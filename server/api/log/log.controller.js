const resObject = require('../resObject')
const LogService = require('../../services/log.service');
const UsersService = require('../../services/users.service');

class LogController {
    constructor() {
        this.lService = new LogService();
        this.uService = new UsersService();

        this.getUserLogs = async (req, res, next) => {
            try {
              const dataOne = await this.uService.findOne(req.session.userInfo.id);
              const userId = Number(dataOne.addedBy) || req.session.userInfo.id;
              const dataAddedBy = await this.uService.findAllAddedBy(userId);
              const usersId = [];
              dataAddedBy.forEach(el => usersId.push(el.id))
              const data = await this.lService.read(usersId);
                const response = resObject(200, true, 'Log inquiry success', data);
                res.send(response);
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage) ? err.sqlMessage : err.message, null);
                res.send(response);
            }
        };

        this.insertNoteLog = async (req, res, next) => {
            const logData =req.logData;
            try {
                await this.lService.addNote(logData);
                logData.addedBy = req.session.userInfo.name;
            } catch (err) {
                console.error(err);
            } finally {
                const response = resObject(201, true, 'Note addition success', logData);
                res.send(response);
            }
        }
        this.editNoteLog = async (req, res, next) => {
            const logData = req.logData;
            logData.user_id = req.session.userInfo.id;
            try {
                await this.lService.updateNote(logData);
            } catch (err) {
                console.error(err);
            } finally {
                const response = resObject(200, true, 'Change note content', logData);
                res.send(response);
            }
        }
        this.updateLabelNoteLog = async (req, res, next) => {
            const logData = req.logData;
            logData.user_id = req.session.userInfo.id;
            try {
                await this.lService.updateLabelNote(logData);
            } catch (err) {
                console.error(err);
            } finally {
                const response = resObject(200, true, 'Change note label', logData);
                res.send(response);
            }
        }
        this.updateColorNoteLog = async (req, res, next) => {
            const logData = req.logData;
            logData.user_id = req.session.userInfo.id;
            try {
                await this.lService.updateColorNote(logData);
            } catch (err) {
                console.error(err);
            } finally {
                const response = resObject(200, true, 'Change note color', logData);
                res.send(response);
            }
        }

        this.updateBackgroundNoteLog = async (req, res, next) => {
            const logData = req.logData;
            logData.user_id = req.session.userInfo.id;
            try {
                await this.lService.updateBackgroundNote(logData);
            } catch (err) {
                console.error(err);
            } finally {
                const response = resObject(200, true, 'Change note background', logData);
                res.send(response);
            }
        }

        this.addMemberNoteLog = async (req, res, next) => {
            const logData = req.logData;
            logData.user_id = req.session.userInfo.id;
            try {
                await this.lService.addMemberNote(logData);
            } catch (err) {
                console.error(err);
            } finally {
                const response = resObject(200, true, 'Member addition to note success', logData);
                res.send(response);
            }
        }
        this.updateMemberNoteLog = async (req, res, next) => {
            const logData = req.logData;
            logData.user_id = req.session.userInfo.id;
            try {
                await this.lService.updateMemberNote(logData);
            } catch (err) {
                console.error(err);
            } finally {
                const response = resObject(200, true, 'Change note member', logData);
                res.send(response);
            }
        }

        this.moveNoteLog = async (req, res, next) => {
            const logData = req.logData;
            if(!logData)
                res.send({message: null});

            logData.user_id = req.session.userInfo.id;
            try {
                await this.lService.moveNote(logData);
            } catch (err) {
                console.error(err);
            } finally {
                const response = resObject(200, true, 'Change note position', logData);
                res.send(response);
            }
        }

        this.removeNoteLog = async (req, res, next) => {
            const logData = req.logData;
            logData.user_id = req.session.userInfo.id;
            try {
                await this.lService.removeNote(logData);
            } catch (err) {
                console.error(err);
            } finally {
                const response = resObject(200, true, 'Note deletion success', logData);
                res.send(response);
            }
        }

        this.insertColumnLog = async (req, res, next) => {
            const logData = req.logData;
            logData.user_id = req.session.userInfo.id;
            try {
                await this.lService.addColumn(logData);
            } catch (err) {
                console.error(err);
            } finally {
                const response = resObject(201, true, 'Column add success', logData);
                res.send(response);
            }
        }

        this.editColumnLog = async (req, res, next) => {
            const logData = req.logData;
            logData.user_id = req.session.userInfo.id;
            try {
                await this.lService.updateColumn(logData);
            } catch (err) {
                console.error(err);
            } finally {
                const response = resObject(200, true, 'Column name change success', logData);
                res.send(response);
            }
        }

        this.removeColumnLog = async (req, res, next) => {
            const logData = req.logData;
            logData.user_id = req.session.userInfo.id;
            try {
                await this.lService.removeColumn(logData);
            } catch (err) {
                console.error(err);
            } finally {
                const response = resObject(200, true, 'Column drop success', logData);
                res.send(response);
            }
        }
    }
}


module.exports = new LogController();
