'use strict';

var express = require('express');
var controller = require('./endpoint.controller');

var router = express.Router();

router.get('/', controller.handle);
router.get('/', controller.handle);
router.post('/', controller.handle);
router.put('/', controller.handle);
router.patch('/', controller.handle);
router.delete('/', controller.handle);

module.exports = router;
