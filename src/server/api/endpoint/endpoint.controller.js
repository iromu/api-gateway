'use strict';

var API_VERSION_KEY = 'X-Api-Version';
var API_VERSION_KEY_LC = API_VERSION_KEY.toLowerCase();

var _ = require('lodash');
var querystring = require('querystring');
var util = require('util');
var request = require('request');
var service = require('./endpoint.service.js');
var crypto = require('crypto');
var hash;

exports.handle = function (req, res) {
  var tokenizeUrl = req.originalUrl.split('/');
  var code = tokenizeUrl[1];
  tokenizeUrl.splice(0, 2);
  var upstreamPath = tokenizeUrl.join('/');
  var upstreamQuerying = upstreamPath.split('?')[1];
  upstreamPath = upstreamPath.split('?')[0];
  var apiVersion = getApiVersionFromRequest(req);

  if (upstreamPath && _.contains(upstreamPath, 'swagger.json')) {
    console.info('Special endpoint swagger.json');
    passApiDocument({code: code, apiVersion: apiVersion, host: req.get('host')}, res);

  } else {
    console.info('Proxy pass init');
    passEndpoint({code: code, apiVersion: apiVersion}, req, upstreamQuerying, upstreamPath, res);
  }
};

var getApiVersionFromRequest = function (req) {
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

var passApiDocument = function (apiRequest, res) {
  service.getApiDocument(apiRequest)
    .then(function (apiResponse) {
      res.set(apiResponse.headers);
      return res.send(apiResponse.body);
    })
    .catch(function (error) {
      if (error) {
        return handleError(res, error);
      } else {
        return res.send(404);
      }
    })
    .done();
};

var passEndpoint = function (passRequest, req, upstreamQuerystring, upstreamPath, res) {
  service.passEndpoint(passRequest)
    .then(function (options) {
      options.headers = _.merge(options.headers, req.headers);
      var qs = querystring.parse(upstreamQuerystring);
      delete qs[API_VERSION_KEY];
      options.url = options.url + upstreamPath + '?' + querystring.stringify(qs);
      req.pipe(request(options)).pipe(res);
    }).catch(function (error) {
      if (error) {
        return handleError(res, error);
      }
      if (!error) {
        return res.sendStatus(404);
      }
    }).done();
};

function handleError(res, err) {
  console.error(err);
  try {
    return res.sendStatus(500).json(err);
  }
  catch (e) {

  }
}
