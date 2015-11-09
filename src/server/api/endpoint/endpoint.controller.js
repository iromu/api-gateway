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

exports.handle = function (req, res) {

  var tokenizedUrl = req.originalUrl.split('/');
  var code = tokenizedUrl[1];

  tokenizedUrl.splice(0, 2);

  var upstreamPath = tokenizedUrl.join('/');
  var upstreamQuerystring = upstreamPath.split('?')[1];
  upstreamPath = upstreamPath.split('?')[0];

  var apiVersion = getApiVersion(req);

  service.findEndpoint(code, apiVersion, function (error, options) {
    if (error) {
      return handleError(res, error);
    }
    if (!options) {
      return res.send(404);
    }

    options.headers = _.merge(options.headers, req.headers);

    var qs = querystring.parse(upstreamQuerystring);
    delete qs[API_VERSION_KEY];
    options.url = options.url + upstreamPath + '?' + querystring.stringify(qs);

    if (upstreamPath && _.contains(upstreamPath, 'swagger.json')) {
      service.getApiDoc({code: code, apiVersion: apiVersion, host: req.get('host')}, options)
        .then(function (response) {
          res.set(response.headers);
          return res.send(response.body);
        })
        .catch(function (error) {
          if (error) {
            return handleError(res, error);
          } else {
            return res.send(404);
          }
        })
        .done();

    } else {
      var method = req.originalMethod;
      if ('GET' === method) {
        var url = options.url;
        var headers = JSON.stringify(req.headers);
        //if (!hash) {
        hash = crypto.createHmac('sha512', req.secret || req.sessionID);
        //}
        hash.update(url + headers);
        var value = hash.digest('hex');

        // print result
        console.log(value);
      }
      //console.log('options ' + JSON.stringify(options));
      req.pipe(request(options)).pipe(res);
    }
  });
};

function handleError(res, err) {
  console.error(err);
  return res.sendStatus(500).json(err);
}
