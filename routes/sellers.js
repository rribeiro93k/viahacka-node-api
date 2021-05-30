const express = require('express');
var router = express.Router()

const SERVER_STATUS = require('../enum/server-status');

const ibmdb = require("ibm_db");
const connStr = "DATABASE=BLUDB;HOSTNAME=dashdb-txn-sbox-yp-dal09-14.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=xrz69130;PWD=44k8g5m12^1sg0sc;";

router.get('/:user', (req, res) => {

  const user = req.params.user || null;
  if (!user) {
    res.status(SERVER_STATUS.UNPROCESSABLE_ENTITY).send({ error: 'Please, provide the user name' });
    return;
  }

  ibmdb.open(connStr, (err, connection) => {
    if (err) {
      res.status(SERVER_STATUS.INTERNAL_ERROR).send({ error: 'IbmDb open connection failed' });
      return;
    }

    const query = `SELECT L.ID AS "id", L.NOME AS "nome", L.USER AS "user", L.CATEGORIA_RANKING AS "categoria_ranking", L.PROGRESS AS "progress" FROM XRZ69130.APPLOJISTA L WHERE "USER" LIKE '${user}'`;
    connection.query(query, (connErr, data) => {
      if (connErr) {
        res.status(SERVER_STATUS.INTERNAL_ERROR).send({ error: connErr });
      } else {
        res.status(SERVER_STATUS.SUCCESS).send(data[0]);
      }
      connection.close((connCloseErr) => {
        if (connCloseErr) res.status(SERVER_STATUS.INTERNAL_ERROR).send({ error: connCloseErr });
      });
    });
  });

});

router.get('/:userId/conquistas', (req, res) => {

  const userId = req.params.userId || null;
  if (!userId) {
    res.status(SERVER_STATUS.UNPROCESSABLE_ENTITY).send({ error: 'Please, provide the userId' });
    return;
  }

  ibmdb.open(connStr, (err, connection) => {
    if (err) {
      res.status(SERVER_STATUS.INTERNAL_ERROR).send({ error: 'IbmDb open connection failed' });
      return;
    }

    const query = `SELECT
      C.ID AS "id", C.TIPO AS "tipo", C.DESCRICAO AS "descricao", C.DATA_INICIO AS "data_inicio", C.DATA_TERMINO AS "data_termino"
      FROM XRZ69130.APPCONQUISTAS C
      WHERE C.LOJISTA_ID = ${userId};`;

    connection.query(query, (connErr, data) => {
      if (connErr) {
        res.status(SERVER_STATUS.INTERNAL_ERROR).send({ error: connErr });
      } else {
        res.status(SERVER_STATUS.SUCCESS).send(data);
      }
      connection.close((connCloseErr) => {
        if (connCloseErr) res.status(SERVER_STATUS.INTERNAL_ERROR).send({ error: connCloseErr });
      });
    });
  });

});

router.get('/:userId/desafios', (req, res) => {

  const userId = req.params.userId || null;
  if (!userId) {
    res.status(SERVER_STATUS.UNPROCESSABLE_ENTITY).send({ error: 'Please, provide the userId' });
    return;
  }

  ibmdb.open(connStr, (err, connection) => {
    if (err) {
      res.status(SERVER_STATUS.INTERNAL_ERROR).send({ error: 'IbmDb open connection failed' });
      return;
    }

    const query = `SELECT
      D.ID AS "id", D.CATEGORIA AS "categoria", D.DESCRICAO AS "descricao", D.PROGRESSO AS "progresso", R.TIPO AS "recompensa_tipo", R.DESCRICAO AS "recompensa_descricao", R.VALOR_COINS AS "recompensa_coins"
      FROM XRZ69130.APPDESAFIOS D
      JOIN XRZ69130.APPRECOMPENSAS R
      ON D.RECOMPENSA_ID = R.ID
      WHERE D.LOJISTA_ID = ${userId};`;
    connection.query(query, (connErr, data) => {
      if (connErr) {
        res.status(SERVER_STATUS.INTERNAL_ERROR).send({ error: connErr });
      } else {
        res.status(SERVER_STATUS.SUCCESS).send(data);
      }
      connection.close((connCloseErr) => {
        if (connCloseErr) res.status(SERVER_STATUS.INTERNAL_ERROR).send({ error: connCloseErr });
      });
    });
  });

});

module.exports = router;
