// db.js — shared mysql2 pool for MediaDB.
// Settings come from .env (copy .env.example). The app connects as the
// least-privilege media_app account from sql/app_user.sql, never as root.
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  dateStrings: true,         // return DATE columns as 'YYYY-MM-DD', not JS Date objects
  decimalNumbers: true       // return DECIMAL (rating, duration) as numbers, not strings
});

module.exports = pool;
