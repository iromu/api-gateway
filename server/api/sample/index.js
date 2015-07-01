'use strict';

var express = require('express');
var controller = require('./sample.controller');

var router = express.Router();

router.get('/v1/hello', controller.v1);
router.get('/v2/hello', controller.v2);


module.exports = router;
