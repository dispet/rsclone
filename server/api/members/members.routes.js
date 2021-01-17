const express = require('express');

const router = express.Router();
const memberController = require('./members.controller')
const auth = require('../../middleware/auth')

router.post('/', memberController.insertMembers);

router.get('/', auth, memberController.findAllMembers);
router.get('/find', auth, memberController.findMembers);
module.exports = router;
