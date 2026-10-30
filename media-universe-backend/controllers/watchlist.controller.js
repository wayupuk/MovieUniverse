// controllers/watchlist.controller.js — Watch list page (Page 8).
// Every route here runs after requireRole('user'), so req.user.accountID is
// always a logged-in Normal_User (Watchlist.accountID references Normal_User).
const pool = require('../db');
const { serverError } = require('../middleware/errors');
const { MEDIA_SELECT } = require('./media.query');
const { addMediaThumbnail } = require('../thumbnails');

// GET /watchlist — the logged-in user's watchlist.
exports.list = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      ${MEDIA_SELECT}
      JOIN Watchlist w ON w.id = m.id
      WHERE w.accountID = ?
      ORDER BY m.title`, [req.user.accountID]);
    res.json(rows.map(addMediaThumbnail));
  } catch (err) {
    serverError(res, err);
  }
};

// POST /watchlist   { media_id }
// User Flow 4: user adds a media -> login already checked -> INSERT for this account.
exports.add = async (req, res) => {
  try {
    const { media_id } = req.body;
    if (!media_id) return res.status(400).json({ error: 'media_id is required' });
    await pool.execute(
      'INSERT INTO Watchlist (accountID, id) VALUES (?, ?)',
      [req.user.accountID, media_id]);
    res.status(201).json({ accountID: req.user.accountID, media_id: Number(media_id) });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'already in your watchlist' });
    if (err.code === 'ER_NO_REFERENCED_ROW_2')
      return res.status(404).json({ error: 'media not found' });
    serverError(res, err);
  }
};

// DELETE /watchlist/:mediaId
// User Flow 6: user removes a media -> DELETE by media id for this account.
exports.remove = async (req, res) => {
  try {
    const [r] = await pool.execute(
      'DELETE FROM Watchlist WHERE accountID = ? AND id = ?',
      [req.user.accountID, req.params.mediaId]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'not in your watchlist' });
    res.status(204).end();
  } catch (err) {
    serverError(res, err);
  }
};
