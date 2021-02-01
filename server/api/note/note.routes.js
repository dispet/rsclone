const express = require('express');

const router = express.Router();
const noteController = require('./note.controller')
const logController = require('../log/log.controller')

router.get('/:noteId', noteController.findNote);
router.post('/', noteController.insertNote, logController.insertNoteLog);
router.put('/update', noteController.updateNote, logController.editNoteLog);
router.put('/label', noteController.updateLabelNote, logController.updateLabelNoteLog);
router.put('/addMember', noteController.addMemberNote, logController.addMemberNoteLog);
router.put('/member', noteController.updateMemberNote, logController.updateMemberNoteLog);
router.put('/background', noteController.updateBackgroundNote, logController.updateBackgroundNoteLog);
router.put('/color', noteController.updateColorNote, logController.updateColorNoteLog);
router.put('/move', noteController.moveNote, logController.moveNoteLog);
router.delete('/:noteId', noteController.deleteNote, logController.removeNoteLog);

module.exports = router;
