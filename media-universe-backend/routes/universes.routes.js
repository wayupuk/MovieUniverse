// routes/universes.routes.js — Discover Universe (Page 6) and Universe page (Page 7).
const router = require('express').Router();
const c = require('../controllers/universes.controller');
const { requireRole } = require('../middleware/auth');

router.get('/',    c.list);                                        // Flow 9: top 10 universes
router.get('/:id', c.getOne);                                      // all media + books of one universe
router.post('/',   requireRole('admin', 'developer'), c.create);   // admin adds a universe

module.exports = router;
