const express = require('express');
var router = express.Router()

const SERVER_STATUS = require('../enum/server-status');

const ibmdb = require("ibm_db");
const connStr = "DATABASE=BLUDB;HOSTNAME=dashdb-txn-sbox-yp-dal09-14.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=xrz69130;PWD=44k8g5m12^1sg0sc;";

router.get('/', (req, res) => {

  console.log('iniciando conexão ibmdb...')

  ibmdb.open(connStr, (err, connection) => {
    if (err) {
      res.status(SERVER_STATUS.INTERNAL_ERROR).send({ error: err });
      return;
    }
    console.log('conexão aberta...')

    const query = 'SELECT * FAKE_TABLE_TEST';
    connection.query(query, (connErr, data) => {
      if (connErr) {
        res.status(SERVER_STATUS.INTERNAL_ERROR).send({ error: connErr });
        return;
      }

      res.status(SERVER_STATUS.SUCCESS).send(data);

      connection.close((connCloseErr) => {
        if (connCloseErr) res.status(SERVER_STATUS.INTERNAL_ERROR).send({ error: connCloseErr });
      });
    });
  });

});

module.exports = router;
