'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Service = require('../service/service.model');
var redisClient = require('../../components/redis').getRedisClient();
var redis = require('redis');
var Q = require('q');
var request = require('request');

var _findEndpoint = function (code, apiVersion, cb) {

  var populateOptions = {
    path: 'endpoints',
    select: 'apiVersion uri -_id'
  };

  Service
    .findOne({code: code}, {'endpoints': {$elemMatch: {apiVersion: apiVersion}}})
    //.populate(populateOptions)
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
        url: upstreamUrl
      };

      options.headers = _.merge(service.endpoints[0].headers, service.defaultHeaders);
      cb(undefined, options);
    }
  );
};


var isLatestVersion = function (apiVersion) {
  return !apiVersion || '@latest' === apiVersion.toLowerCase() || 'latest' === apiVersion.toLowerCase();
};

exports.findEndpoint = function (code, apiVersion, cb) {
  if (isLatestVersion(apiVersion)) {
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

        //console.debug('endpoint findEndpoint service ' + JSON.stringify(service));
        apiVersion = service.latestVersion;
        _findEndpoint(code, apiVersion, cb);
      });
  } else {
    _findEndpoint(code, apiVersion, cb);
  }
};


exports.getApiDoc = function (env, options) {
  var deferred = Q.defer();
  var key = 'apiDoc:' + env.code + ':' + ((isLatestVersion(env.apiVersion)) ? '@latest' : env.apiVersion);

  console.log('cache key ' + key);
  redisClient.get(key, function (err, reply) {
    if (reply) {
      console.log('found cache entry with key ' + key);
      deferred.resolve(JSON.parse(reply));
    } else {
      request(options, function (error, response, body) {
          if (error) {
            deferred.reject(error);
          }
          else if (!body) {
            deferred.reject(undefined);
          }
          else {
            // Replace basePath and host to match this running server
            var match = /"basePath" *?: *?".+?" *?,/;
            body = body.replace(match, '"basePath":"/' + env.code + '",');

            var host = env.host;
            match = /"host" *?: *?".+?" *?,/;
            body = body.replace(match, '"host":"' + host + '",');

            var apiDoc = {headers: response.headers, body: JSON.parse(body)};

            console.log('storing new cache entry with key ' + key);

            redisClient.set(key, JSON.stringify(apiDoc), redis.print);
            redisClient.expire(key, 300);

            deferred.resolve(apiDoc);
          }
        }
      );
    }
  });

  return deferred.promise;
};
