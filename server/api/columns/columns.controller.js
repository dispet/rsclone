const resObject = require('../resObject')
const ColumnsService = require('../../services/columns.service');

class ColumnsController {
    constructor() {
        this.cService = new ColumnsService();

        this.findColumns = async (req, res, next) => {
            try {
                const columnsId = req.params.columnsId;
                const data = await this.cService.findOne(columnsId);
                const response = resObject(200, true, 'Column lookup success', data);
                res.send(response);
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage)? err.sqlMessage : err.message, null);
                res.send(response);
            }
        };

        this.insertColumns = async (req, res, next) => {
            try {
                const columnsDTO = {
                    name: req.body.name,
                    user_id: req.session.userInfo.id
                }
                req.logData = await this.cService.create(columnsDTO);
                next();
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage)? err.sqlMessage : err.message, null);
                res.send(response);
            }
        }
        this.updateHead = async (req, res, next) => {
            try {
                const columnsDTO = {
                    id:req.body.id,
                    head: req.body.head
                }
                const data = await this.cService.update(columnsDTO);
                const response = resObject(200, true, 'column Head Modification success', data);
                res.send(response);
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage) ? err.sqlMessage : err.message, null);
                res.send(response);
            }
        }

        this.updateName = async (req, res, next) => {
            try {
                const columnsDTO = {
                    id: req.body.id,
                    name: req.body.name
                }
                req.logData = await this.cService.rename(columnsDTO);
                next();
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage) ? err.sqlMessage : err.message, null);
                res.send(response);
            }
        }

        this.deleteColumns = async (req, res, next) => {
            try {
                const columnsId = req.params.columnsId;
                const data = await this.cService.delete(columnsId);
                req.logData = {
                    subject: data
                };
                next();
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage)? err.sqlMessage : err.message, null);
                res.send(response);
            }
        }
    }
}


module.exports = new ColumnsController();
