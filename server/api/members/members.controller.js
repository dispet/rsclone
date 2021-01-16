const resObject = require('../resObject')
const MembersService = require('../../services/members.service');

class MembersController {
    constructor() {
        this.mService = new MembersService();
        this.findAllMembers = async (req, res, next) => {
            try {
                const data = await this.mService.findAll(req.params.userId);
                const response = resObject(200, true, 'Member inquiry success', data);
                res.send(response);
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage)? err.sqlMessage : err.message, null);
                res.send(response);
            }
        };

        this.findMembers = async (req, res, next) => {
            try {
                const membersId = req.params.membersId;
                const data = await this.mService.findOne(membersId);
                const response = resObject(200, true, 'Member inquiry success', data);
                res.send(response);
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage)? err.sqlMessage : err.message, null);
                res.send(response);
            }
        }

        this.insertMembers = async (req, res, next) => {
            try {
                const membersDTO = {
                    email : req.body.email,
                    name: req.body.name
                }
                const data = await this.mService.create(membersDTO);
                const response = resObject(201, true, 'Successful member addition', data);
                res.send(response);
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage)? err.sqlMessage : err.message, null);
                res.send(response);
            }
        }

    }
}


module.exports = new MembersController();
