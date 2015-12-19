'use strict';

var logger = require('log4js').getLogger('service.service');

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Q = require('q');
var repository = require('./service.repository');
var cache = require('../../components/cache/index').getCacheClient();
var Service = require('./service.model.js');
var crypto = require('crypto');

exports.getPage = function (request) {
  var deferred = Q.defer();
  var hash = crypto.createHash('md5').update(JSON.stringify(request)).digest("hex");
  var cacheKey = 'page:service:' + hash;

  logger.debug('Cache key Service.getPage ' + cacheKey);

  function refreshCache() {
    Service.paginate(request.filter, request.options)
      .spread(function (data, pageCount, itemCount) {
        var dataCombined = {headers: {total: itemCount}, body: data};
        var cacheData = JSON.stringify(dataCombined);
        cache.set(cacheKey, cacheData);
        deferred.resolve(dataCombined);
      })
      .catch(function (err) {
        logger.error('Rejected Service.getPage');
        deferred.reject(err);
      });
  }

  cache.get(cacheKey)
    .then(function (data) {
      if (data) {
        deferred.resolve(JSON.parse(data));
      } else {
        refreshCache();
      }
    })
    .catch(function (error) {
      logger.error('Rejected Service.getPage');
      deferred.reject(error);
    });

  return deferred.promise;
};
