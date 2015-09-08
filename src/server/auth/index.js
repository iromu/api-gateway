'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment/index');
var User = require('../api/user/user.model.js');

// Passport Configuration
require('./local/passport').setup(User, config);
require('./facebook/passport').setup(User, config);
require('./google/passport').setup(User, config);
require('./twitter/passport').setup(User, config);
require('./github/passport').setup(User, config);

var router = express.Router();

router.use('/local', require('./local/index'));
router.use('/facebook', require('./facebook/index'));
router.use('/twitter', require('./twitter/index'));
router.use('/google', require('./google/index'));
router.use('/github', require('./github/index'));

module.exports = router;
