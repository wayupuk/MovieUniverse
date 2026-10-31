// routes/stats.routes.js — Statistics page (Page 10). Admin / developer only.
const router = require('express').Router();
const c = require('../controllers/stats.controller');
const { requireRole } = require('../middleware/auth');

router.use(requireRole('admin', 'developer'));

router.get('/',          c.overview);       // Flow 10: dashboard numbers
router.get('/group',     c.group);          // custom group + sort
router.get('/visits',    c.visits);         // visits per day + most visited
router.get('/media/:id', c.mediaProfile);   // profile of one media

module.exports = router;
