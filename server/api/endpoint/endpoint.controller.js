'use strict';

var API_VERSION_KEY = 'X-Api-Version';
var API_VERSION_KEY_LC = API_VERSION_KEY.toLowerCase();

var _ = require('lodash');
var util = require('util');
var request = require('request');
var service = require('./endpoint.service');

var getApiVersion = function (req) {
  var apiVersion;

  if (API_VERSION_KEY_LC in req.headers) {
    apiVersion = req.headers[API_VERSION_KEY_LC];
    delete req.headers[API_VERSION_KEY_LC];
  } else if (API_VERSION_KEY in req.query) {
    apiVersion = req.query[API_VERSION_KEY];
    delete req.query[API_VERSION_KEY_LC];
  }
  return apiVersion;
};

var handleApiDoc = function (res, env, options) {
  request(options, function (error, response, body) {

      var match = /"basePath" *?: *?".+?" *?,/;
      body = body.replace(match, '"basePath":"/' + env.code + '",');

      var host = env.host;
      match = /"host" *?: *?".+?" *?,/;
      body = body.replace(match, '"host":"' + host + '",');

      res.set(response.headers);
      return res.send(body);
    }
  ).on('error', function (error) {
      console.log(error);
    });
};

exports.handle = function (req, res) {

  var tokenizedUrl = req.originalUrl.split('/');
  var code = tokenizedUrl[1];

  tokenizedUrl.splice(0, 2);

  var upstreamPath = tokenizedUrl.join('/');

  var apiVersion = getApiVersion(req);

  service.findEndpoint(code, apiVersion, function (error, options) {
    if (error) {
      return handleError(res, error);
    }
    if (!options) {
      return res.send(404);
    }

    options.headers = _.merge(options.headers, req.headers);
    options.url = options.url + upstreamPath;

    if (upstreamPath && _.contains(upstreamPath, 'swagger.json')) {
      handleApiDoc(res, {code: code, host: req.get('host')}, options);
    } else {
      req.pipe(request(options)).pipe(res);
    }
  });
};

function handleError(res, err) {
  return res.status(500).json(err);
}
