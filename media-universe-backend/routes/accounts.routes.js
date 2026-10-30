// routes/accounts.routes.js — Log-in page (Page 5) and account management.
//   user      : register, log in, see own account
//   admin     : + look at every account (read only)
//   developer : + change roles and delete accounts
const router = require('express').Router();
const c = require('../controllers/accounts.controller');
const { requireLogin, requireRole } = require('../middleware/auth');

router.post('/register',  c.register);                        // Flow 5: create account
router.post('/login',     c.login);
router.post('/logout',    requireLogin, c.logout);
router.get('/me',         requireLogin, c.me);
router.get('/',           requireRole('admin', 'developer'), c.list);   // inspect user data
router.put('/:id/role',   requireRole('developer'), c.changeRole);      // developer only
router.delete('/:id',     requireRole('developer'), c.remove);          // developer only

module.exports = router;
