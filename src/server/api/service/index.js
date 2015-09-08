'use strict';

var express = require('express');
var controller = require('./service.controller.js');
var auth = require('../../auth/auth.service.js');

var router = express.Router();

router.get('/', controller.index);
router.get('/typeahead', controller.typeahead);
router.get('/:id', controller.show);
router.get('/:id/versioning', controller.apiVersions);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
