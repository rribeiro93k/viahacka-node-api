const express = require('express');
const compression = require('compression');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

const ibmdb = require("ibm_db");
const connStr = "DATABASE=BLUDB;HOSTNAME=dashdb-txn-sbox-yp-dal09-14.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=xrz69130;PWD=44k8g5m12^1sg0sc;";

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

app.get('/db2-connect', (req, res) => {

  ibmdb.open(connStr, (err, connection) => {
    if (err) {
      res.status(500).send({ error: err });
      return;
    }
    connection.query("select * from FAKE_TABLE_TEST", (err1, rows) => {
      if (err1) {
        res.status(500).send({ error: err1 });
      } else {
        res.status(200).send(rows);
      }
      connection.close((err2) => {
        if (err2) res.status(500).send({ error: err2 });
      });
    });
  });
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
