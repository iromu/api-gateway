'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service.js');

var router = express.Router();

router
  .get('/', passport.authenticate('github', {
    failureRedirect: '/signup',
    scope: [
      'user'
    ],
    session: false
  }))

  .get('/callback', passport.authenticate('github', {
    failureRedirect: '/signup',
    session: false
  }), auth.setTokenCookie);

module.exports = router;
