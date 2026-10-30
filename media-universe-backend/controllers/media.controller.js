// controllers/media.controller.js — Home (Page 1), All Search (Page 2),
// Information page (Page 3) and the administrator Edit page (Page 9).
const pool = require('../db');
const { serverError } = require('../middleware/errors');
const { MEDIA_SELECT } = require('./media.query');
const { addMediaThumbnail, addBookThumbnail } = require('../thumbnails');

// ---------------------------------------------------------------- helpers

const isId = (v) => Number.isInteger(Number(v)) && Number(v) > 0;
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(new Date(v));

// Text columns of Media and their max length (from the physical design).
const TEXT_COLUMNS = {
  title: 100, age_rating: 10, status: 20, synopsis: 255, category: 50, country: 50
};
// Columns of Media that hold a foreign key id. universe / sequel / remake may be null.
const REQUIRED_ID_COLUMNS = ['director_id', 'main_genre_id'];
const OPTIONAL_ID_COLUMNS = ['universe_id', 'sequel_parent_id', 'remake_parent_id'];
const MEDIA_COLUMNS = [...Object.keys(TEXT_COLUMNS), 'publish_date', 'rating',
                       ...REQUIRED_ID_COLUMNS, ...OPTIONAL_ID_COLUMNS];

// M:N tables linked to one media. Body key -> junction table and its other column.
const RELATIONS = {
  subgenre_ids: { table: 'Subgenre',       column: 'genre_id' },
  actor_ids:    { table: 'Media_Actor',    column: 'actor_id' },
  platform_ids: { table: 'Media_Platform', column: 'platform_id' },
  isbns:        { table: 'Media_Book',     column: 'ISBN' }
};

// Returns an error message, or null when the body is fine.
// isCreate = true  -> every required field must be present (POST)
// isCreate = false -> only check the fields that were sent (PUT)
function validateMedia(body, isCreate) {
  for (const [col, max] of Object.entries(TEXT_COLUMNS)) {
    if (body[col] === undefined) { if (isCreate) return `${col} is required`; continue; }
    if (typeof body[col] !== 'string' || body[col].trim() === '' || body[col].length > max)
      return `${col} must be text of 1 to ${max} characters`;
  }
  if (body.publish_date !== undefined || isCreate)
    if (!isDate(body.publish_date)) return 'publish_date must be YYYY-MM-DD';
  if (body.rating !== undefined || isCreate) {
    const r = Number(body.rating);
    if (body.rating === null || body.rating === '' || isNaN(r) || r < 0 || r > 9.9)
      return 'rating must be a number from 0 to 9.9';
  }
  for (const col of REQUIRED_ID_COLUMNS)
    if ((body[col] !== undefined || isCreate) && !isId(body[col])) return `${col} must be a positive id`;
  for (const col of OPTIONAL_ID_COLUMNS)
    if (body[col] !== undefined && body[col] !== null && !isId(body[col]))
      return `${col} must be a positive id or null`;

  if (isCreate && !['movie', 'series'].includes(body.type))
    return "type must be 'movie' or 'series'";
  if (body.duration !== undefined || (isCreate && body.type === 'movie')) {
    const d = Number(body.duration);
    if (isNaN(d) || d <= 0 || d > 999.99) return 'duration (minutes) must be between 0 and 999.99';
  }
  if (body.episode_number !== undefined || (isCreate && body.type === 'series'))
    if (!isId(body.episode_number)) return 'episode_number must be a positive whole number';

  for (const key of Object.keys(RELATIONS))
    if (body[key] !== undefined && !Array.isArray(body[key])) return `${key} must be an array`;
  return null;
}

// Replace the rows of every M:N relation that appears in the body.
async function replaceRelations(conn, mediaId, body) {
  for (const [key, { table, column }] of Object.entries(RELATIONS)) {
    if (body[key] === undefined) continue;
    await conn.execute(`DELETE FROM ${table} WHERE id = ?`, [mediaId]);
    for (const value of new Set(body[key]))
      await conn.execute(`INSERT INTO ${table} (id, ${column}) VALUES (?, ?)`, [mediaId, value]);
  }
}

// Turn a MySQL foreign-key error into a readable 400 message.
function foreignKeyError(err) {
  if (err.code !== 'ER_NO_REFERENCED_ROW_2') return null;
  const col = (err.sqlMessage.match(/FOREIGN KEY \(`(\w+)`\)/) || [])[1] || 'a referenced id';
  return `${col} does not exist`;
}

// Filters shared by GET /media and GET /media/search (all from the query string).
function buildFilters(query) {
  const where = [];
  const params = [];
  if (query.type === 'movie')  where.push('mv.id IS NOT NULL');
  if (query.type === 'series') where.push('s.id IS NOT NULL');
  if (isId(query.genre)) {          // main genre OR sub genre
    where.push(`(m.main_genre_id = ? OR EXISTS
                 (SELECT 1 FROM Subgenre sg WHERE sg.id = m.id AND sg.genre_id = ?))`);
    params.push(query.genre, query.genre);
  }
  if (isId(query.universe)) { where.push('m.universe_id = ?'); params.push(query.universe); }
  if (query.category)       { where.push('m.category = ?');    params.push(query.category); }
  if (query.country)        { where.push('m.country = ?');     params.push(query.country); }
  if (query.status)         { where.push('m.status = ?');      params.push(query.status); }
  return { where, params };
}

const SORTS = {
  rating: 'm.rating DESC',
  newest: 'm.publish_date DESC',
  oldest: 'm.publish_date ASC',
  title:  'm.title ASC'
};

function readLimit(value, fallback = 50) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? Math.min(n, 100) : fallback;
}

// ---------------------------------------------------------------- handlers

// GET /media?type=movie|series&genre=&universe=&category=&country=&status=&sort=&limit=
// Home page: the whole Media joined table, optionally filtered and sorted.
exports.list = async (req, res) => {
  try {
    const { where, params } = buildFilters(req.query);
    const order = SORTS[req.query.sort] || 'm.id ASC';
    const [rows] = await pool.query(
      `${MEDIA_SELECT}
       ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
       ORDER BY ${order}
       LIMIT ?`,
      [...params, readLimit(req.query.limit)]);
    res.json(rows.map(addMediaThumbnail));
  } catch (err) {
    serverError(res, err);
  }
};

// GET /media/search?q=keyword  (+ the same filters as GET /media)
// User Flow 1: user types a keyword -> backend cleans the text -> DB query.
// The keyword is matched against title, synopsis, director, universe, genre,
// actor names, book titles and author names. Title matches are listed first.
exports.search = async (req, res) => {
  try {
    const keyword = String(req.query.q || '').trim().replace(/\s+/g, ' ').slice(0, 100);
    if (!keyword) return res.status(400).json({ error: 'q (search keyword) is required' });

    const like = `%${keyword.replace(/[\\%_]/g, '\\$&')}%`;   // escape LIKE wildcards
    const { where, params } = buildFilters(req.query);
    where.unshift(`(
         m.title LIKE ? OR m.synopsis LIKE ? OR d.director_name LIKE ?
      OR u.universe_name LIKE ? OR g.genre_name LIKE ?
      OR EXISTS (SELECT 1 FROM Media_Actor ma JOIN Actor a ON a.actor_id = ma.actor_id
                 WHERE ma.id = m.id AND a.actor_name LIKE ?)
      OR EXISTS (SELECT 1 FROM Media_Book mb JOIN Book b ON b.ISBN = mb.ISBN
                 LEFT JOIN Author au ON au.author_id = b.author_id
                 WHERE mb.id = m.id AND (b.book_title LIKE ? OR au.author_name LIKE ?)))`);
    params.unshift(like, like, like, like, like, like, like, like);

    const [rows] = await pool.query(
      `${MEDIA_SELECT}
       WHERE ${where.join(' AND ')}
       ORDER BY (m.title LIKE ?) DESC, m.rating DESC
       LIMIT ?`,
      [...params, like, readLimit(req.query.limit)]);
    res.json({ keyword, count: rows.length, results: rows.map(addMediaThumbnail) });
  } catch (err) {
    serverError(res, err);
  }
};

// GET /media/:id
// User Flow 2: user clicks a banner -> information page of that media,
// with everything it is cross-referenced to.
exports.getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.execute(`${MEDIA_SELECT} WHERE m.id = ?`, [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'media not found' });
    const media = rows[0];

    const [[subgenres], [actors], [platforms], [books], [sequelOf], [sequels],
           [remakeOf], [remakes], [sameUniverse]] = await Promise.all([
      pool.execute(`SELECT g.genre_id, g.genre_name FROM Subgenre sg
                    JOIN Genre g ON g.genre_id = sg.genre_id
                    WHERE sg.id = ? ORDER BY g.genre_name`, [id]),
      pool.execute(`SELECT a.actor_id, a.actor_name FROM Media_Actor ma
                    JOIN Actor a ON a.actor_id = ma.actor_id
                    WHERE ma.id = ? ORDER BY a.actor_id`, [id]),
      pool.execute(`SELECT p.platform_id, p.platform_name FROM Media_Platform mp
                    JOIN Platform p ON p.platform_id = mp.platform_id
                    WHERE mp.id = ? ORDER BY p.platform_name`, [id]),
      pool.execute(`SELECT b.ISBN, b.book_title, b.volume, b.book_type, b.publish_date,
                           a.author_name, p.publisher_name
                    FROM Media_Book mb
                    JOIN Book b ON b.ISBN = mb.ISBN
                    LEFT JOIN Author a    ON a.author_id    = b.author_id
                    LEFT JOIN Publisher p ON p.publisher_id = b.publisher_id
                    WHERE mb.id = ? ORDER BY b.volume`, [id]),
      pool.execute('SELECT id, title, publish_date FROM Media WHERE id = ?',
                    [media.sequel_parent_id]),
      pool.execute('SELECT id, title, publish_date FROM Media WHERE sequel_parent_id = ? ORDER BY publish_date',
                    [id]),
      pool.execute('SELECT id, title, publish_date FROM Media WHERE id = ?',
                    [media.remake_parent_id]),
      pool.execute('SELECT id, title, publish_date FROM Media WHERE remake_parent_id = ? ORDER BY publish_date',
                    [id]),
      pool.execute(`SELECT id, title, publish_date, rating FROM Media
                    WHERE universe_id = ? AND id <> ? ORDER BY publish_date`,
                    [media.universe_id, id])
    ]);

    // Every linked media / book carries its own thumbnail so the page can show banners.
    res.json({
      ...addMediaThumbnail(media),
      subgenres, actors, platforms,
      books: books.map(addBookThumbnail),
      sequel_of: addMediaThumbnail(sequelOf[0]) || null,
      sequels: sequels.map(addMediaThumbnail),
      remake_of: addMediaThumbnail(remakeOf[0]) || null,
      remakes: remakes.map(addMediaThumbnail),
      same_universe: sameUniverse.map(addMediaThumbnail)
    });
  } catch (err) {
    serverError(res, err);
  }
};

// POST /media   (admin / developer)
// User Flow 7: administrator adds a new movie or series.
// Body: Media columns + type ('movie' | 'series') + duration or episode_number
//       + optional arrays subgenre_ids, actor_ids, platform_ids, isbns
exports.create = async (req, res) => {
  const body = req.body;
  const problem = validateMedia(body, true);
  if (problem) return res.status(400).json({ error: problem });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [r] = await conn.execute(
      `INSERT INTO Media (${MEDIA_COLUMNS.join(', ')})
       VALUES (${MEDIA_COLUMNS.map(() => '?').join(', ')})`,
      MEDIA_COLUMNS.map((col) => body[col] ?? null));
    const id = r.insertId;

    if (body.type === 'movie')
      await conn.execute('INSERT INTO Movies (id, duration) VALUES (?, ?)', [id, body.duration]);
    else
      await conn.execute('INSERT INTO Series (id, episode_number) VALUES (?, ?)', [id, body.episode_number]);

    await replaceRelations(conn, id, body);
    await conn.commit();
    res.status(201).json({ id, title: body.title, type: body.type });
  } catch (err) {
    await conn.rollback();
    const fk = foreignKeyError(err);
    if (fk) return res.status(400).json({ error: fk });
    serverError(res, err);
  } finally {
    conn.release();
  }
};

// PUT /media/:id   (admin / developer)
// Edit page: send only the fields you want to change. duration / episode_number
// update the Movies / Series row; relation arrays replace the old links.
exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;
  const problem = validateMedia(body, false);
  if (problem) return res.status(400).json({ error: problem });
  if (body.sequel_parent_id == id || body.remake_parent_id == id)
    return res.status(400).json({ error: 'a media cannot be its own sequel or remake parent' });

  const columns = MEDIA_COLUMNS.filter((col) => body[col] !== undefined);
  const touchesSubtype = body.duration !== undefined || body.episode_number !== undefined;
  const touchesRelations = Object.keys(RELATIONS).some((key) => body[key] !== undefined);
  if (!columns.length && !touchesSubtype && !touchesRelations)
    return res.status(400).json({ error: 'nothing to update' });

  const conn = await pool.getConnection();
  try {
    const [found] = await conn.execute('SELECT id FROM Media WHERE id = ?', [id]);
    if (found.length === 0) return res.status(404).json({ error: 'media not found' });

    await conn.beginTransaction();
    if (columns.length)
      await conn.execute(
        `UPDATE Media SET ${columns.map((col) => `${col} = ?`).join(', ')} WHERE id = ?`,
        [...columns.map((col) => body[col]), id]);

    if (body.duration !== undefined) {
      const [r] = await conn.execute('UPDATE Movies SET duration = ? WHERE id = ?', [body.duration, id]);
      if (r.affectedRows === 0) throw Object.assign(new Error('this media is not a movie'), { status: 400 });
    }
    if (body.episode_number !== undefined) {
      const [r] = await conn.execute('UPDATE Series SET episode_number = ? WHERE id = ?', [body.episode_number, id]);
      if (r.affectedRows === 0) throw Object.assign(new Error('this media is not a series'), { status: 400 });
    }

    await replaceRelations(conn, id, body);
    await conn.commit();
    res.json({ updated: id });
  } catch (err) {
    await conn.rollback();
    const fk = foreignKeyError(err);
    if (fk) return res.status(400).json({ error: fk });
    if (err.status) return res.status(err.status).json({ error: err.message });  // our own 400s above
    serverError(res, err);
  } finally {
    conn.release();
  }
};

// PUT /media/:id/genres   (admin / developer)   { main_genre_id, subgenre_ids: [] }
// User Flow 8: administrator changes the genre of a movie or series.
exports.updateGenres = async (req, res) => {
  const id = req.params.id;
  const { main_genre_id, subgenre_ids } = req.body;
  if (main_genre_id === undefined && subgenre_ids === undefined)
    return res.status(400).json({ error: 'main_genre_id or subgenre_ids is required' });
  if (main_genre_id !== undefined && !isId(main_genre_id))
    return res.status(400).json({ error: 'main_genre_id must be a positive id' });
  if (subgenre_ids !== undefined && !Array.isArray(subgenre_ids))
    return res.status(400).json({ error: 'subgenre_ids must be an array' });

  const conn = await pool.getConnection();
  try {
    const [found] = await conn.execute('SELECT id FROM Media WHERE id = ?', [id]);
    if (found.length === 0) return res.status(404).json({ error: 'media not found' });

    await conn.beginTransaction();
    if (main_genre_id !== undefined)
      await conn.execute('UPDATE Media SET main_genre_id = ? WHERE id = ?', [main_genre_id, id]);
    await replaceRelations(conn, id, { subgenre_ids });
    await conn.commit();

    const [subgenres] = await pool.execute(
      `SELECT g.genre_id, g.genre_name FROM Subgenre sg
       JOIN Genre g ON g.genre_id = sg.genre_id WHERE sg.id = ?`, [id]);
    const [[media]] = await pool.execute(
      `SELECT m.main_genre_id, g.genre_name AS main_genre FROM Media m
       JOIN Genre g ON g.genre_id = m.main_genre_id WHERE m.id = ?`, [id]);
    res.json({ id: Number(id), ...media, subgenres });
  } catch (err) {
    await conn.rollback();
    const fk = foreignKeyError(err);
    if (fk) return res.status(400).json({ error: fk });
    serverError(res, err);
  } finally {
    conn.release();
  }
};

// DELETE /media/:id   (admin / developer)
// Removes the media and every row that points at it, in one transaction.
exports.remove = async (req, res) => {
  const id = req.params.id;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // Sequels / remakes of this media lose their parent instead of being deleted.
    await conn.execute('UPDATE Media SET sequel_parent_id = NULL WHERE sequel_parent_id = ?', [id]);
    await conn.execute('UPDATE Media SET remake_parent_id = NULL WHERE remake_parent_id = ?', [id]);
    for (const table of ['Subgenre', 'Watchlist', 'Media_Actor', 'Media_Platform',
                         'Media_Book', 'Movies', 'Series'])
      await conn.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
    const [r] = await conn.execute('DELETE FROM Media WHERE id = ?', [id]);

    if (r.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'media not found' });
    }
    await conn.commit();
    res.status(204).end();
  } catch (err) {
    await conn.rollback();
    serverError(res, err);
  } finally {
    conn.release();
  }
};
