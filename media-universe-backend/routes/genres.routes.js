// routes/genres.routes.js — Genre selection page (Page 4).
const router = require('express').Router();
const c = require('../controllers/genres.controller');

router.get('/',          c.list);    // genre buttons / dropdown
router.get('/:id/media', c.media);   // Flow 3: media in the selected genre

module.exports = router;
