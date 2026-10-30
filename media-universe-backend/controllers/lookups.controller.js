// controllers/lookups.controller.js — dropdown data for the Edit page (Page 9),
// so the admin form can pick a director, genre, actor ... by name instead of typing ids.
const pool = require('../db');
const { serverError } = require('../middleware/errors');

// GET /lookups
exports.all = async (req, res) => {
  try {
    const [[directors], [genres], [universes], [actors], [platforms], [books]] = await Promise.all([
      pool.query('SELECT director_id, director_name FROM Director ORDER BY director_name'),
      pool.query('SELECT genre_id, genre_name FROM Genre ORDER BY genre_name'),
      pool.query('SELECT universe_id, universe_name FROM Universe ORDER BY universe_name'),
      pool.query('SELECT actor_id, actor_name FROM Actor ORDER BY actor_name'),
      pool.query('SELECT platform_id, platform_name FROM Platform ORDER BY platform_name'),
      pool.query('SELECT ISBN, book_title, volume FROM Book ORDER BY book_title, volume')
    ]);
    res.json({ directors, genres, universes, actors, platforms, books });
  } catch (err) {
    serverError(res, err);
  }
};
