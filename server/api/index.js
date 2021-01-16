const express = require('express');

const router = express.Router();

const users = require('./users/users.routes');
const members = require('./members/members.routes');
const columns = require('./columns/columns.routes');
const note = require('./note/note.routes');
const log = require('./log/log.routes')
const auth = require('../middleware/auth')

router.get('/', (req, res, next) => {
  res.render('index')
})
router.use('/api/users', users);

router.use(auth);
router.use('/api/columns', columns);
router.use('/api/note', note);
router.use('/api/log', log);

router.use('/api/members', members);
module.exports = router;
