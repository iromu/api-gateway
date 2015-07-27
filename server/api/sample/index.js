'use strict';

var express = require('express');
var controller = require('./sample.controller');

var router = express.Router();

router.get('/v*/swagger.json', controller.apiDoc);

router.get('/v*/hello', controller.hello);


module.exports = router;
