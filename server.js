const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).send({ message: 'Hacka Node API' });
});

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
