const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => res.render('main'));
router.get('/login', (req, res, next) => res.render('login'));
router.get('/signup', (req, res, next) => res.render('signup'));

module.exports = router;
