const express = require('express');
const compression = require('compression');
const cors = require('cors');
const app = express();
var port = process.env.PORT || 3000;

app.use(cors({ origin: true }));
app.use(compression());

app.use((req, res, next) => {
  const token = req.headers.authorization;
  const isValidtoken = isValidToken(token);

  if (!isValidtoken) {
    const UNAUTHORIZED = 401;
    res.status(UNAUTHORIZED).json({ 'error': `Invalid token` });
    return;
  }

  next()
})

app.use((req, res, next) => {
  const err = `${req.method} ${req.url} Not Found`;
  err.status = 404
  res.status(err.status);
  next(err);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

app.get('/', (req, res) => {
  res.status(200).send({ message: 'Hacka Node API' });
});

// Routes
const users = require('./routes/users');
app.use('/users', users);

app.listen(port, () => {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});


// TODO: Implement token validation
function isValidToken(token) {
  return true;
}
