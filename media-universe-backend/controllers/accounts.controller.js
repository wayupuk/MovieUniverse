// controllers/accounts.controller.js — Log-in page (Page 5) and user data for admins.
// User Flow 5: create account -> backend hashes password -> INSERT into User + Normal_User
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { serverError } = require('../middleware/errors');
const { createSession, destroySession, destroySessionsOf } = require('../middleware/auth');

// One account with its role. Developer / Admin / Normal_User are disjoint subtypes of User.
const ACCOUNT_SELECT = `
  SELECT u.accountID, u.username, u.gmail, u.password,
         CASE WHEN d.accountID IS NOT NULL THEN 'developer'
              WHEN a.accountID IS NOT NULL THEN 'admin'
              ELSE 'user' END AS role
  FROM User u
  LEFT JOIN Developer d ON d.accountID = u.accountID
  LEFT JOIN Admin a     ON a.accountID = u.accountID`;

// POST /accounts/register   { username, password, gmail }
exports.register = async (req, res) => {
  const { username, password, gmail } = req.body;
  if (typeof username !== 'string' || typeof password !== 'string' || typeof gmail !== 'string'
      || !username.trim() || !password || !gmail)
    return res.status(400).json({ error: 'username, password and gmail are required' });
  if (username.length > 60 || gmail.length > 100)
    return res.status(400).json({ error: 'username max 60 characters, gmail max 100 characters' });
  if (password.length < 8)
    return res.status(400).json({ error: 'password must be at least 8 characters' });
  if (!/^\S+@\S+\.\S+$/.test(gmail))
    return res.status(400).json({ error: 'gmail is not a valid email address' });

  const conn = await pool.getConnection();
  try {
    const hash = await bcrypt.hash(password, 10);   // bcrypt hash is exactly 60 chars
    await conn.beginTransaction();
    const [r] = await conn.execute(
      'INSERT INTO User (username, password, gmail) VALUES (?, ?, ?)',
      [username, hash, gmail]);
    await conn.execute('INSERT INTO Normal_User (accountID) VALUES (?)', [r.insertId]);
    await conn.commit();
    res.status(201).json({ accountID: r.insertId, username, gmail, role: 'user' });
  } catch (err) {
    await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'username or gmail is already used' });
    serverError(res, err);
  } finally {
    conn.release();
  }
};

// POST /accounts/login   { username, password }   (username may also be the gmail)
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'username and password are required' });

    const [rows] = await pool.execute(
      `${ACCOUNT_SELECT} WHERE u.username = ? OR u.gmail = ?`, [username, username]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'wrong username or password' });

    const token = createSession(user);
    res.json({ token, accountID: user.accountID, username: user.username, role: user.role });
  } catch (err) {
    serverError(res, err);
  }
};

// POST /accounts/logout   (logged in)
exports.logout = (req, res) => {
  destroySession(req.token);
  res.status(204).end();
};

// GET /accounts/me   (logged in)
exports.me = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `${ACCOUNT_SELECT} WHERE u.accountID = ?`, [req.user.accountID]);
    if (rows.length === 0) return res.status(404).json({ error: 'account not found' });
    const { password, ...account } = rows[0];   // never send the password hash
    res.json(account);
  } catch (err) {
    serverError(res, err);
  }
};

// GET /accounts   (admin / developer) — inspect user data, with watchlist size
exports.list = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.accountID, u.username, u.gmail,
             CASE WHEN d.accountID IS NOT NULL THEN 'developer'
                  WHEN a.accountID IS NOT NULL THEN 'admin'
                  ELSE 'user' END AS role,
             COUNT(w.id) AS watchlist_count
      FROM User u
      LEFT JOIN Developer d ON d.accountID = u.accountID
      LEFT JOIN Admin a     ON a.accountID = u.accountID
      LEFT JOIN Watchlist w ON w.accountID = u.accountID
      GROUP BY u.accountID, u.username, u.gmail, role
      ORDER BY u.accountID`);
    res.json(rows);
  } catch (err) {
    serverError(res, err);
  }
};

// ---------------------------------------------------------------- developer only
// Developers manage accounts; admins can only look at them (GET /accounts above).

// Subtype table for each role. A role change moves the account between these tables.
const ROLE_TABLES = { user: 'Normal_User', admin: 'Admin', developer: 'Developer' };

// Remove an account from every subtype table (and its watchlist, which needs Normal_User).
async function clearRole(conn, accountID) {
  await conn.execute('DELETE FROM Watchlist WHERE accountID = ?', [accountID]);
  for (const table of Object.values(ROLE_TABLES))
    await conn.execute(`DELETE FROM ${table} WHERE accountID = ?`, [accountID]);
}

// PUT /accounts/:id/role   { role: 'user' | 'admin' | 'developer', contract? }
// Admin / Developer rows need a contract text; a default is used when none is sent.
// Becoming admin / developer removes the user's watchlist (only normal users have one).
exports.changeRole = async (req, res) => {
  const accountID = Number(req.params.id);
  const { role } = req.body;
  if (!ROLE_TABLES[role])
    return res.status(400).json({ error: "role must be 'user', 'admin' or 'developer'" });
  if (accountID === req.user.accountID)
    return res.status(400).json({ error: 'you cannot change your own role' });
  const contract = String(req.body.contract || `${role} account`).slice(0, 250);

  const conn = await pool.getConnection();
  try {
    const [found] = await conn.execute(`${ACCOUNT_SELECT} WHERE u.accountID = ?`, [accountID]);
    if (found.length === 0) return res.status(404).json({ error: 'account not found' });
    if (found[0].role === role) return res.json({ accountID, role, changed: false });

    await conn.beginTransaction();
    await clearRole(conn, accountID);
    if (role === 'user')
      await conn.execute('INSERT INTO Normal_User (accountID) VALUES (?)', [accountID]);
    else
      await conn.execute(`INSERT INTO ${ROLE_TABLES[role]} (accountID, contract) VALUES (?, ?)`,
                         [accountID, contract]);
    await conn.commit();

    destroySessionsOf(accountID);   // they log in again and get the new role
    res.json({ accountID, role, changed: true });
  } catch (err) {
    await conn.rollback();
    serverError(res, err);
  } finally {
    conn.release();
  }
};

// DELETE /accounts/:id   — removes the account and its watchlist.
exports.remove = async (req, res) => {
  const accountID = Number(req.params.id);
  if (accountID === req.user.accountID)
    return res.status(400).json({ error: 'you cannot delete your own account' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await clearRole(conn, accountID);
    const [r] = await conn.execute('DELETE FROM User WHERE accountID = ?', [accountID]);
    if (r.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'account not found' });
    }
    await conn.commit();
    destroySessionsOf(accountID);
    res.status(204).end();
  } catch (err) {
    await conn.rollback();
    serverError(res, err);
  } finally {
    conn.release();
  }
};
