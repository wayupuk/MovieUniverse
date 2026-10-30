// middleware/auth.js — very small token login kept in memory.
// After POST /accounts/login the client sends:  Authorization: Bearer <token>
// Sessions are cleared when the server restarts (fine for a class project).
const crypto = require('crypto');

const sessions = new Map();   // token -> { accountID, username, role }

exports.createSession = (user) => {
  const token = crypto.randomUUID();
  sessions.set(token, { accountID: user.accountID, username: user.username, role: user.role });
  return token;
};

exports.destroySession = (token) => sessions.delete(token);

// Log one account out everywhere (after its role changed or it was deleted).
exports.destroySessionsOf = (accountID) => {
  for (const [token, session] of sessions)
    if (session.accountID === accountID) sessions.delete(token);
};

function readToken(req) {
  const header = req.get('Authorization') || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

// Any logged-in account.
exports.requireLogin = (req, res, next) => {
  const token = readToken(req);
  const session = token && sessions.get(token);
  if (!session) return res.status(401).json({ error: 'please log in first' });
  req.user = session;
  req.token = token;
  next();
};

// Logged in AND one of the given roles: 'user', 'admin', 'developer'.
// Usage in a router:  router.post('/', requireRole('admin', 'developer'), c.create)
exports.requireRole = (...roles) => [
  exports.requireLogin,
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ error: `only ${roles.join(' / ')} accounts can do this` });
    next();
  }
];
