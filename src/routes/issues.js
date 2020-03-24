import * as dbHelper from '../services/db';
import express from 'express';
var router = express.Router();

const NO_ID = 'No id passed.';
const WRONG_BODY = 'Body is not fulfilled.';

router.get('/', async function(req, res) {
    dbHelper.getAllRecords()
      .then(response => res.status(200).send(response))
      .catch(error => res.status(500).send(error));
});

router.get('/:id', async function (req, res) {
    if (!req.params.id) {
        res.status(400).send({ message: NO_ID });
    }

    dbHelper.getRecord(req.params.id)
        .then(response => res.status(200).send(response))
        .catch(error => res.status(500).send(error));
});

router.post('/', async function(req, res) {
    if (!req.body) {
        res.status(400).send({ message: WRONG_BODY });
    }

    dbHelper.addRecord(req.body)
        .then(response => res.status(200).send(response))
        .catch(error => res.status(500).send(error));
});

router.delete('/:id', async function(req, res) {
    if (!req.body) {
      res.status(400).send({ message: NO_ID });
    }

    dbHelper.deleteRecord(req.params.id)
        .then(response => res.status(200).send(response))
        .catch(error => res.status(500).send(error));
});

router.put('/:id', async function(req, res) {
    if (!req.body) {
      res.status(400).send({ message: NO_ID });
    }

    dbHelper.updateRecord(req.params.id, req.body)
        .then(response => res.status(200).send(response))
        .catch(error => res.status(500).send(error));
});

export default router;
