const express = require('express');

const router = express.Router();
const columnsController = require('./columns.controller')
const logController = require('../log/log.controller')

router.get('/:columnsId', columnsController.findColumns);
router.post('/', columnsController.insertColumns, logController.insertColumnLog); // Log
router.put('/head', columnsController.updateHead);
router.put('/rename', columnsController.updateName, logController.editColumnLog); // Log
router.delete('/:columnsId', columnsController.deleteColumns, logController.removeColumnLog); // Log

module.exports = router;
