// routes/watchlist.routes.js — Watch list page (Page 8). Normal users only.
const router = require('express').Router();
const c = require('../controllers/watchlist.controller');
const { requireRole } = require('../middleware/auth');

router.use(requireRole('user'));          // every watchlist route needs a logged-in user

router.get('/',            c.list);
router.post('/',           c.add);        // Flow 4: add to watchlist
router.delete('/:mediaId', c.remove);     // Flow 6: remove from watchlist

module.exports = router;
