'use strict';

var fs = require('fs');
var path = require('path');
var template = JSON.parse(fs.readFileSync(path.join(__dirname, './swagger.json'), 'utf-8'));

var API_VERSION_KEY = 'X-Api-Version';
var apiVersion;

var filterApiVersion = function (req, res) {

  if ('x-api-version' in req.headers) {
    apiVersion = req.headers['x-api-version'];
  } else if (API_VERSION_KEY in req.query) {
    apiVersion = req.query[API_VERSION_KEY];
  }

  console.info('api version %s', apiVersion)

  res.set('x-api-version', apiVersion);
  return apiVersion;
};

exports.apiDoc = function (req, res) {
  filterApiVersion(req, res);
  template.info.version = apiVersion;
  return res.status(200).json(template);
};

exports.v1 = function (req, res) {
  filterApiVersion(req, res);
  return res.status(200).json({message: 'Hello world', version: apiVersion});
};

exports.v2 = function (req, res) {
  filterApiVersion(req, res);
  return res.status(200).json({message: 'Hello world', version: apiVersion});
};
