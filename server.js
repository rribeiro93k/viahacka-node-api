const express = require('express');
const compression = require('compression');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const SERVER_STATUS = require('./enum/server-status');


app.use(cors({ origin: true }));
app.use(compression());

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || SERVER_STATUS.INTERNAL_ERROR);
  res.json({
    error: {
      message: err.message,
    },
  });
});

app.get('/', (req, res) => {
  res.status(SERVER_STATUS.SUCCESS).send({ message: 'Hacka Node API' });
});

// Routes
const sellers = require('./routes/sellers');
app.use('/sellers', sellers);

app.listen(port, () => {
  console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
