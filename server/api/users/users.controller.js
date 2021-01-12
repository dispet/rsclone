const resObject = require('../resObject')
const UsersService = require('../../services/users.service');

class UsersController {
    constructor() {
        this.uService = new UsersService();
        this.findAllUsers = async (req, res, next) => {
            try {
                const data = await this.uService.findAll();
                const response = resObject(200, true, 'User inquiry success', data);
                res.send(response);
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage)? err.sqlMessage : err.message, null);
                res.send(response);
            }
        };

        this.findUsers = async (req, res, next) => {
            try {
                const userId = req.session.userInfo.id;
                const data = await this.uService.findOne(userId);
                const response = resObject(200, true, 'User inquiry success', data);
                res.send(response);
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage)? err.sqlMessage : err.message, null);
                res.send(response);
            }
        }

        this.getColumns = async (req, res, next) => {
            try {
                const userId = req.session.userInfo.id;
                const data = await this.uService.getColumns(userId);
                const response = resObject(200, true, 'Column lookup success', data);
                res.send(response);
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage)? err.sqlMessage : err.message, null);
                res.send(response);
            }
        }

        this.insertUsers = async (req, res, next) => {
            try {
                const usersDTO = {
                    email : req.body.email,
                    password : req.body.password,
                    name: req.body.name,
                    phone : req.body.phone
                }
                const data = await this.uService.create(usersDTO);
                const response = resObject(201, true, 'Successful user addition', data);
                res.send(response);
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage)? err.sqlMessage : err.message, null);
                res.send(response);
            }
        }

        this.login = async (req, res, next) => {
            try {
                const loginForm = {
                    email: req.body.email,
                    password: req.body.password
                }
                const checkResult = await this.uService.checkValid(loginForm);

                if (checkResult.isLogin) {
                    req.session.userInfo = {
                        id: checkResult.id,
                        name: checkResult.userName
                    }
                    const response = resObject(201, true, 'log-in succeed', req.session.userInfo);
                    res.send(response);
                }
            } catch (err) {
                const response = resObject(400, false, (err.sqlMessage) ? err.sqlMessage : err.message, null);
                res.send(response);
            }
        }

        this.logout = async (req, res, next) => {
            try {
                req.session.destroy();
                const response = resObject(200, true, 'Logout successful', null);
                res.send(response);
            } catch (err) {
                const response = resObject(400, false, err.message, null);
                res.send(response);
            }
        }

        this.loginCheck = async (req, res, next) => {
            if (req.session.userInfo){
                const response = resObject(200, true, 'login O', true);
                res.send(response);
            }else {
                const response = resObject(200, true, 'login X', false);
                res.send(response);
            }
        }

    }
}


module.exports = new UsersController();
