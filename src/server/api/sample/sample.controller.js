'use strict';

var fs = require('fs');
var util = require('util');
var path = require('path');
var template = JSON.parse(fs.readFileSync(path.join(__dirname, './swagger.json'), 'utf-8'));

var apiVersion;
var apiVersionText;

var allowedApiVersion = ['1.0.1', '2.0.0', '2.0.3', '2.1.0'];

var getApiVersion = function (req, res) {
  var re = /^\/v(\d+)/g;
  var str = req.url;
  var m;

  while ((m = re.exec(str)) !== null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    apiVersionText = m[1];
    apiVersion = apiVersionText.split('').join('.');
  }

  console.log('getApiVersionFromRequest req.url ' + req.url);
  console.log('getApiVersionFromRequest apiVersion ' + apiVersion);
  if (allowedApiVersion.indexOf(apiVersion) === -1) {
    return res.send(404);
  }
  res.set('Sample-Api-Version', apiVersion);
  return apiVersion;
};

exports.apiDoc = function (req, res) {
  var apiVersion = getApiVersion(req, res);
  template.info.version = apiVersion;
  template.host = req.get('host');
  template.basePath = '/api/v' + apiVersionText;
  return res.status(200).json(template);
};

exports.hello = function (req, res) {
  var apiVersion = getApiVersion(req, res);
  res.set('Echo-Header-Response', req.headers['echo-header']);
  res.cookie('echo-token-response', req.cookies['echo-token'], {
    domain: 'test.example.com',
    path: '/api/samples/v' + apiVersionText,
    maxAge: 900000,
    httpOnly: true
  });

  return res.status(200).json({message: 'Hello world', version: apiVersion});
};
