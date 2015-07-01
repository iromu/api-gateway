'use strict';

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
  }
  console.info('code %s api version', code, apiVersion);

  Service
    .findOne({code: code}, {'endpoints': {$elemMatch: {apiVersion: apiVersion}}})
    .populate(populateOptions)
    .lean()
    .exec(function (err, service) {
      if (err) {
        return handleError(res, err);
      }
      if (!service) {
        return res.sendStatus(404);
      }
      console.info('service %s', util.inspect(service, 2));

      var upstreamUrl = service.endpoints[0].uri + '/' + upstreamPath;
      var x = request(upstreamUrl);
      req.pipe(x);
      x.pipe(res);
    });

};

function handleError(res, err) {
  return res.status(500).json(err);
}
