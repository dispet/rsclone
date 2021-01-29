const express = require('express');

const router = express.Router();
const userController = require('./users.controller')
const auth = require('../../middleware/auth')


router.post('/auth/login', userController.login);
router.post('/', userController.insertUsers);
router.get('/auth/loginCheck', userController.loginCheck);

router.get('/auth/logout', auth, userController.logout);
router.get('/', auth, userController.findAllUsers);

router.get('/addedBy', auth, userController.findAllAddedByUsers);
router.get('/find', auth, userController.findUsers);
router.get('/find/:userId', auth, userController.findUserById);
router.get('/columns', auth, userController.getColumns);
module.exports = router;
