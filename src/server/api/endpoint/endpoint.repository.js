'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Service = require('../service/service.model');
var redisClient = require('../../components/cache/index').getRedisClient();
var redis = require('redis');
var Q = require('q');
var request = require('request');

exports.findOne = function (model) {
  console.log('EndpointRepository.findOne ' + JSON.stringify(model));
  return Service.findOne(model).lean().exec();
};

exports.findOne = function (model, predicate) {
  console.log('EndpointRepository.findOne ' + JSON.stringify(model) + ' with predicate ' + JSON.stringify(predicate));
  return Service.findOne(model, predicate).lean().exec();
};

exports.updateAll = function (find, update) {
  console.log('EndpointRepository.updateAll ' + JSON.stringify(find));
  Service.collection.update(find, update);
};


exports.getApiDocModel = function (apiRequest) {

  console.info('Entering EndpointRepository.getApiDocModel');

  var deferred = Q.defer();
  try {
    if (apiRequest.apiDoc) {
      console.log('checkApiDocModel EndpointRepository.apiRequest.apiDoc? true');
      deferred.resolve(apiRequest);
    } else {
      console.log('EndpointRepository.getApiDocModel. Pulling from upstream url: ' + apiRequest.apiBaseUrl);
      var options = {};

      options.uri = _.startsWith(apiRequest.apiBaseUrl, '/') ? 'http://' + apiRequest.host + apiRequest.apiBaseUrl : apiRequest.apiBaseUrl;

      request(options, function (error, response, body) {
          if (error) {
            console.error('Rejected EndpointRepository.getApiDocModel');
            deferred.reject(error);
          }
          else if (!body) {
            console.warn('Rejected EndpointRepository.getApiDocModel. Not Found');
            deferred.reject(undefined);
          }
          else {
            apiRequest.headers = response.headers;
            apiRequest.apiDoc = body;
            deferred.resolve(apiRequest);
          }
        }
      );
    }
  } catch (err) {
    console.error('Rejected EndpointRepository.getApiDocModel');
    deferred.reject(err);
  }
  return deferred.promise;
};
