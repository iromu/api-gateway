'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Service = require('../service/service.model');

var _findEndpoint = function (code, apiVersion, cb) {

  var populateOptions = {
    path: 'endpoints',
    select: 'apiVersion uri -_id'
  };

  Service
    .findOne({code: code}, {'endpoints': {$elemMatch: {apiVersion: {$eq: apiVersion}}}})
    .populate(populateOptions)
    .lean()
    .exec(function (err, service) {
      if (err) {
        return cb(err);
      }
      if (!service || !service.endpoints) {
        return cb(undefined);
      }

      Service.collection.update({code: code, 'endpoints.apiVersion': apiVersion}, {
        $inc: {
          'endpoints.$.hits': 1,
          'hits': 1
        }
      });

      var upstreamUrl = service.endpoints[0].uri + '/';

      var options = {
        url: upstreamUrl//,
        //headers: {'test-header': 'old', 'test-header-extra': 'old'}
      };

      options.headers = _.merge(service.endpoints[0].headers, service.defaultHeaders);
      cb(undefined, options);
    }
  );
};


exports.findEndpoint = function (code, apiVersion, cb) {
  if (!apiVersion || '@latest' === apiVersion.toLowerCase() || 'latest' === apiVersion.toLowerCase()) {
    Service
      .findOne({code: code})
      .lean()
      .exec(function (err, service) {
        if (err) {
          return cb(err);
        }
        if (!service) {
          return cb(undefined);
        }
        apiVersion = service.latestVersion;
        _findEndpoint(code, apiVersion, cb);
      });
  } else {
    _findEndpoint(code, apiVersion, cb);
  }
};
