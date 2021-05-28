const express = require('express');
var router = express.Router()

router.get('/', (req, res) => {
  res.status(200);
  res.json("GET list users endpoint");
});

router.post('/save', (req, res) => {
  res.status(200);
  res.json("POST save users endpoint");
});

module.exports = router;
