'use strict';

var fs = require('fs');
var util = require('util');
var path = require('path');
var template = JSON.parse(fs.readFileSync(path.join(__dirname, './swagger.template.json'), 'utf-8'));

var allowedApiVersion = ['1.0.1', '2.0.0', '2.0.3', '2.1.0'];

var getApiVersion = function (req, res) {

  var apiVersion;
  var apiVersionText;

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
  return {version: apiVersion, text: apiVersionText};
};

exports.apiDoc = function (req, res) {
  var apiVersion = getApiVersion(req, res);
  template.info.version = apiVersion.version;
  template.host = req.get('host');
  template.basePath = '/api/v' + apiVersion.text;
  return res.status(200).json(template);
};

exports.hello = function (req, res) {
  var apiVersion = getApiVersion(req, res);
  res.set('Echo-Header-Response', req.headers['echo-header']);
  res.cookie('echo-token-response', req.cookies['echo-token'], {
    domain: 'test.example.com',
    path: '/api/samples/v' + apiVersion.text,
    maxAge: 900000,
    httpOnly: true
  });

  return res.status(200).json({message: 'Hello world', version: apiVersion.version});
};
