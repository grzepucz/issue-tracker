import * as dbHelper from '../services/db';
import express from 'express';
var router = express.Router();

router.get('/', async function(req, res) {
  await dbHelper.getAllRecords().then(response => res.json(response));
});

router.get('/:id', async function (req, res) {
  if (req.params.id) {
    await dbHelper.getRecord(req.params.id).then(response => res.json(response));
  } else {
    res.send({
      status: 400,
      message: 'Wrong params',
    });
  }
});

router.post('/', async function(req, res) {
  if (req.body) {
    await dbHelper.addRecord(req.body).then(response => res.json(response));
  } else {
    res.send({
      message: 'body is not fulfilled'
    });
  }
});

router.delete('/:id', async function(req, res) {
  if (req.body) {
    await dbHelper.deleteRecord(req.params.id).then(response => res.json(response));
  } else {
    res.send({
      message: 'No id passed'
    });
  }
});

router.put('/:id', async function(req, res) {
  if (req.body) {
    await dbHelper.updateRecord(req.params.id, req.body).then(response => res.json(response));
  } else {
    res.send({
      message: 'No id passed'
    });
  }
});

export default router;
