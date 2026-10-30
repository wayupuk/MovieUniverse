// routes/lookups.routes.js — dropdown data for the Edit page (Page 9).
const router = require('express').Router();
const c = require('../controllers/lookups.controller');

router.get('/', c.all);

module.exports = router;
