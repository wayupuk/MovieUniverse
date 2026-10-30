// controllers/genres.controller.js — Genre selection page (Page 4).
// User Flow 3: user selects a genre -> backend sends the genre id -> DB re-queries Media.
const pool = require('../db');
const { serverError } = require('../middleware/errors');
const { MEDIA_SELECT } = require('./media.query');
const { addMediaThumbnail } = require('../thumbnails');

// GET /genres — every genre with how many media use it (as main or sub genre).
exports.list = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT g.genre_id, g.genre_name,
             (SELECT COUNT(*) FROM Media m WHERE m.main_genre_id = g.genre_id) AS main_count,
             (SELECT COUNT(*) FROM Subgenre s WHERE s.genre_id = g.genre_id)  AS sub_count
      FROM Genre g
      ORDER BY g.genre_name`);
    res.json(rows);
  } catch (err) {
    serverError(res, err);
  }
};

// GET /genres/:id/media — all media whose main genre OR a sub genre is this genre.
// Each row says whether the match was on the main genre.
exports.media = async (req, res) => {
  try {
    const [genre] = await pool.execute('SELECT * FROM Genre WHERE genre_id = ?', [req.params.id]);
    if (genre.length === 0) return res.status(404).json({ error: 'genre not found' });

    const [media] = await pool.execute(`
      SELECT * FROM (${MEDIA_SELECT}) AS x
      WHERE x.main_genre_id = ?
         OR x.id IN (SELECT id FROM Subgenre WHERE genre_id = ?)
      ORDER BY (x.main_genre_id = ?) DESC, x.rating DESC`,
      [req.params.id, req.params.id, req.params.id]);
    res.json({ ...genre[0], count: media.length, media: media.map(addMediaThumbnail) });
  } catch (err) {
    serverError(res, err);
  }
};
