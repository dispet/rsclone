const resObject = require('../resObject')
const NoteService = require('../../services/note.service');

class NoteController {
    constructor() {
        this.nService = new NoteService();

        this.findNote = async (req, res, next) => {
            try {
                const noteId = req.params.noteId;
                const data = await this.nService.findOne(noteId);
                const response = resObject(200, true, 'Note lookup success', data);
                res.send(response);
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage)? err.sqlMessage : err.message, null);
                res.send(response);
            }
        };

        this.insertNote = async (req, res, next) => {
            try {
                const noteDTO = {
                    columns_id: req.body.columns_id,
                    content: req.body.content,
                    addedBy: req.session.userInfo.id,
                }
                req.logData = await this.nService.create(noteDTO);
                next();
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage)? err.sqlMessage : err.message, null);
                res.send(response);
            }
        }
        this.updateNote = async (req, res, next) => {
            try {
                const noteDTO = {
                    id: req.body.id,
                    content: req.body.content
                }
                req.logData = await this.nService.update(noteDTO);
                next();
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage)? err.sqlMessage : err.message, null);
                res.send(response);
            }
        }
        this.updateLabelNote = async (req, res, next) => {
            try {
                const noteDTO = {
                    id: req.body.id,
                    label: req.body.label
                }
                req.logData = await this.nService.updateLabel(noteDTO);
                next();
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage)? err.sqlMessage : err.message, null);
                res.send(response);
            }
        }

        this.addMemberNote = async (req, res, next) => {
            try {
                const noteDTO = {
                    id: req.body.id,
                    name: req.body.name,
                    member: req.body.member
                }
                req.logData = await this.nService.addMember(noteDTO);
                next();
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage)? err.sqlMessage : err.message, null);
                res.send(response);
            }
        }

        this.updateMemberNote = async (req, res, next) => {
            try {
                const noteDTO = {
                    id: req.body.id,
                    member: req.body.member
                }
                req.logData = await this.nService.updateMember(noteDTO);
                next();
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage)? err.sqlMessage : err.message, null);
                res.send(response);
            }
        }

        this.moveNote = async (req, res, next) => {
            try {
                const noteDTO = {
                    id: req.body.id,
                    columns_id: req.body.columns_id,
                    next_note: req.body.next_note
                }
                req.logData = await this.nService.move(noteDTO);
                next();
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage)? err.sqlMessage : err.message, null);
                res.send(response);
            }
        }

        this.deleteNote = async (req, res, next) => {
            try {
                const noteId = req.params.noteId;
                req.logData = await this.nService.delete(noteId);
                next();
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage)? err.sqlMessage : err.message, null);
                res.send(response);
            }
        }
    }
}


module.exports = new NoteController();
