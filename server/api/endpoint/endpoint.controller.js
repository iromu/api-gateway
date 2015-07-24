'use strict';

var API_VERSION_KEY = 'X-Api-Version';

var _ = require('lodash');
var util = require('util');
var request = require('request');
var Service = require('../service/service.model');

exports.handle = function (req, res) {

  var tokenizedUrl = req.originalUrl.split('/');
  var code = tokenizedUrl[1];
  tokenizedUrl.splice(0, 2);

  var upstreamPath = tokenizedUrl.join('/');

  var populateOptions = {
    path: 'endpoints',
    select: 'apiVersion uri -_id'
  };

  var apiVersion;

  if ('x-api-version' in req.headers) {
    apiVersion = req.headers['x-api-version'];
  } else if (API_VERSION_KEY in req.query) {
    apiVersion = req.query[API_VERSION_KEY];
  }

  console.info('code %s api version %s', code, apiVersion);

  var findEndpoint = function () {
    Service
      .findOne({code: code}, {'endpoints': {$elemMatch: {apiVersion: {$eq: apiVersion}}}})
      .populate(populateOptions)
      .lean()
      .exec(function (err, service) {
        if (err) {
          return handleError(res, err);
        }
        if (!service || !service.endpoints) {
          return res.sendStatus(404);
        }
        console.info('service %s', util.inspect(service, 2));

        var upstreamUrl = service.endpoints[0].uri + '/' + upstreamPath;
        var x = request(upstreamUrl);
        req.pipe(x);
        x.pipe(res);
      });
  };

  if (!apiVersion) {
    Service
      .findOne({code: code})
      .lean()
      .exec(function (err, service) {
        if (err) {
          return handleError(res, err);
        }
        if (!service) {
          return res.sendStatus(404);
        }
        apiVersion = service.latestVersion;

        console.info('code %s latest api version %s', code, apiVersion);
        findEndpoint();
      });
  } else {
    findEndpoint();
  }


};

function handleError(res, err) {
  return res.status(500).json(err);
}
