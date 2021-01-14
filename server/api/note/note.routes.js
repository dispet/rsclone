const express = require('express');

const router = express.Router();
const noteController = require('./note.controller')
const logController = require('../log/log.controller')

router.get('/:noteId', noteController.findNote);
router.post('/', noteController.insertNote, logController.insertNoteLog); //
router.put('/update', noteController.updateNote, logController.editNoteLog); //
router.put('/move', noteController.moveNote, logController.moveNoteLog); //
router.delete('/:noteId', noteController.deleteNote, logController.removeNoteLog); //

module.exports = router;
