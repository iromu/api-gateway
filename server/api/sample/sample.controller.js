'use strict';

var fs = require('fs');
var path = require('path');
var template = JSON.parse(fs.readFileSync(path.join(__dirname, './swagger.json'), 'utf-8'));

var apiVersion;
var apiVersionText;

var getApiVersion = function (req, res) {
  var re = /^\/v(\d+)/g;
  var str = req.url;
  var m;

  while ((m = re.exec(str)) !== null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    apiVersionText = m[1];
    apiVersion = m[1].split('').join('.');
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
