'use strict';

var cache = require('../../components/cache/index').getCacheClient();
var Q = require('q');
var Service = require('./service.model.js');
var _ = require('lodash');

exports.typeahead = function (codeFilter) {
  var deferred = Q.defer();
  var filter = {};
  filter.code = new RegExp(codeFilter, 'i');

  var cacheKey = 'typeahead:' + codeFilter;

  var refreshCache = function () {
    Service.find(filter)
      .limit(10)
      .sort('public code')
      .select('code')
      .lean()
      .exec(function (err, data) {
        if (err) {
          deferred.reject(err);
        } else {
          var input = _.map(data, 'code');
          deferred.resolve(input);
          var codeArray;
          try {
            codeArray = JSON.stringify(input);
          } catch (e) {
            deferred.reject('error on JSON.stringify: ' + e);
          }
          cache.set(cacheKey, codeArray, 360);
        }
      });
  };
  cache.get(cacheKey)
    .then(function (result) {
      if (result) {
        deferred.resolve(JSON.parse(result));
      } else {
        refreshCache();
      }
    })
    .catch(function (error) {
      deferred.reject(error);
    });


  return deferred.promise;
};
