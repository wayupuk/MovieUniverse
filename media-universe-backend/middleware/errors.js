// middleware/errors.js — safe error answers.
// The real MySQL error (table names, SQL text ...) is only printed in the server
// terminal. The browser gets a generic message, so no database details leak.

exports.serverError = (res, err) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong, please try again later' });
};

// Last app.use() in app.js: anything a route did not catch ends up here.
exports.errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed')
    return res.status(400).json({ error: 'request body is not valid JSON' });
  exports.serverError(res, err);
};
