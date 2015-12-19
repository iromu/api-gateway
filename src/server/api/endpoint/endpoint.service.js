'use strict';

var logger = require('log4js').getLogger('endpoint.service');

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Q = require('q');
var repository = require('./endpoint.repository');
var cache = require('../../components/cache/index').getCacheClient();

var isLatestVersion = function (apiVersion) {
  return !apiVersion || '@latest' === apiVersion.toLowerCase() || 'latest' === apiVersion.toLowerCase();
};


var optionsResponse = function (apiRequest) {
  var deferred = Q.defer();

  var populateOptions = {
    path: 'endpoints',
    select: 'apiVersion uri -_id'
  };

  repository
    .findOne({code: apiRequest.code}, {'endpoints': {$elemMatch: {apiVersion: apiRequest.apiVersion}}})
    //.populate(populateOptions)
    //.lean()
    .then(function (service) {
      if (!service || !service.endpoints) {
        logger.warn('Rejected EndpointService.optionsResponse. Not Found');
        deferred.reject(undefined);
      }

      repository.updateAll({code: apiRequest.code, 'endpoints.apiVersion': apiRequest.apiVersion}, {
        $inc: {
          'endpoints.$.hits': 1,
          'hits': 1
        }
      });

      var upstreamUrl = service.endpoints[0].uri + '/';
      upstreamUrl = _.startsWith(upstreamUrl, '/') ? 'http://' + apiRequest.host + upstreamUrl : upstreamUrl;

      var options = {
        url: upstreamUrl//,
        //response: service.endpoints[0].apiDoc
      };
      options.headers = _.merge(service.endpoints[0].headers, service.defaultHeaders) || [];
      logger.info('Resolved EndpointService.optionsResponse, headers: ' + JSON.stringify(options.headers));
      deferred.resolve(options);
    }).catch(function (error) {
      logger.error('Rejected EndpointService.optionsResponse');
      deferred.reject(error);
    })
    .done();

  return deferred.promise;
};


var _getEndpointModel = function (apiRequest) {


  logger.info('Entering EndpointService._getEndpointModel');

  var deferred = Q.defer();

  var populateOptions = {
    path: 'endpoints',
    select: 'apiVersion uri -_id'
  };

  repository
    .findOne({code: apiRequest.code}, {'endpoints': {$elemMatch: {apiVersion: apiRequest.apiVersion}}})
    //.populate(populateOptions)
    //.lean()
    //.exec(function (err, service) {
    .then(function (service) {

      if (!service || !service.endpoints) {
        logger.warn('Rejected EndpointService._getEndpointModel. Not Found');
        deferred.reject(undefined);
      }

      repository.updateAll({code: apiRequest.code, 'endpoints.apiVersion': apiRequest.apiVersion}, {
        $inc: {
          'endpoints.$.hits': 1,
          'hits': 1
        }
      });

      apiRequest.apiDoc = service.endpoints[0].apiDoc;
      logger.info('Resolved EndpointService._getEndpointModel apiDoc? ' + (apiRequest.apiDoc ? true : false) + ', apiBaseUrl: ' + apiRequest.apiBaseUrl);
      deferred.resolve(apiRequest);
    }).catch(function (error) {
      logger.error('Rejected EndpointService._getEndpointModel');
      deferred.reject(error);
    })
    .done();

  return deferred.promise;
};

/**
 * {code: code, apiVersion: apiVersion}
 * */
var getApiModel = function (apiRequest) {
  logger.info('Entering EndpointService.getApiModel');
  var deferred = Q.defer();
  var populateOptions = {
    path: 'endpoints',
    select: 'apiVersion uri -_id'
  };

  repository
    .findOne({code: apiRequest.code}, {'endpoints': {$elemMatch: {apiVersion: apiRequest.apiVersion}}})
    //.populate(populateOptions)
    //.lean()
    //.exec(function (err, service) {
    .then(function (service) {

      if (!service || !service.endpoints) {
        logger.warn('Rejected EndpointService.getApiModel. Not Found');
        deferred.reject(undefined);
      }
      /*
       repository.updateAll({code: apiRequest.code, 'endpoints.apiVersion': apiRequest.apiVersion}, {
       $inc: {
       'endpoints.$.hits': 1,
       'hits': 1
       }
       });*/

      apiRequest.apiDoc = service.endpoints[0].apiDoc;
      apiRequest.apiBaseUrl = service.endpoints[0].apiBaseUrl || (service.endpoints[0].uri + '/swagger.json');

      logger.info('Resolved EndpointService.getApiModel ' +
        'apiDoc? ' + (apiRequest.apiDoc ? true : false) + ', apiBaseUrl: ' + apiRequest.apiBaseUrl);
      deferred.resolve(apiRequest);
    }).catch(function (error) {
      logger.error('Rejected EndpointService.getApiModel');
      deferred.reject(error);
    })
    .done();

  return deferred.promise;
};

var checkApiDocModel = function (apiRequest) {
  if (apiRequest.apiDoc) {
    return apiRequest;
  }
  logger.info('Entering EndpointService.checkApiDocModel apiRequest.apiBaseUrl:' + apiRequest.apiBaseUrl);
  return repository.getApiDocModel(apiRequest);
};


/**
 * Lookup for '@latest' string to endpoint.latestVersion
 * @param apiRequest.code
 * @returns apiRequest with entry apiVersion
 * */
var lookupVersionMarkers = function (apiRequest) {
  logger.info('Entering EndpointService.lookupVersionMarkers');
  var deferred = Q.defer();
  try {
    if (isLatestVersion(apiRequest.apiVersion)) {
      logger.debug('Step EndpointService.lookupVersionMarkers. Find lookupVersionMarkers for ' + apiRequest.code);
      var promise = repository.findOne({code: apiRequest.code});
      promise.then(function (service) {
        if (!service) {
          logger.warn('Rejected EndpointService.lookupVersionMarkers. Not Found');
          deferred.reject(undefined);
        }
        apiRequest.apiVersion = service.latestVersion;
        logger.info('Resolved EndpointService.lookupVersionMarkers. apiRequest.apiVersion: ' + apiRequest.apiVersion);
        deferred.resolve(apiRequest);
      }).catch(function (error) {
        logger.error('Rejected EndpointService.lookupVersionMarkers');
        deferred.reject(error);
      }).done();
    } else {
      logger.info('Resolved EndpointService.lookupVersionMarkers');
      deferred.resolve(apiRequest);
    }
  } catch (err) {
    logger.error('Rejected EndpointService.lookupVersionMarkers');
    deferred.reject(err);
  }
  return deferred.promise;
};

var apiResponse = function (apiRequest) {
  var body = apiRequest.apiDoc;
  // Replace basePath and host to match this running server
  var match = /"basePath" *?: *?".+?" *?,/;
  body = body.replace(match, '"basePath":"/-/' + apiRequest.code + '",');

  var host = apiRequest.host;
  match = /"host" *?: *?".+?" *?,/;
  body = body.replace(match, '"host":"' + host + '",');

  return {headers: [], body: JSON.parse(body)};
};


exports.getApiDocument = function (apiRequest) {
  var deferred = Q.defer();
  var cacheKey = 'apidoc:' + apiRequest.code + ':' + apiRequest.apiVersion;

  var saveApiResponseCache = function (apiResponse) {
    try {
      var data = JSON.stringify(apiResponse);
      cache.set(cacheKey, data);
    } catch (e) {
      deferred.reject('error on JSON.stringify: ' + e);
    }
    return apiResponse;
  };

  function refreshCache() {
    deferred.resolve(lookupVersionMarkers(apiRequest)
      .then(getApiModel)
      .then(checkApiDocModel)
      .then(apiResponse)
      .then(saveApiResponseCache));
  }

  cache.get(cacheKey)
    .then(function (data) {
      if (data) {
        var apiResponse = JSON.parse(data);
        //Override host value from persistence with current running instance
        apiResponse.body.host = apiRequest.host;
        deferred.resolve(apiResponse);
      } else {
        refreshCache();
      }
    })
    .catch(function (error) {
      deferred.reject(error);
    });
  return deferred.promise;
};

exports.passEndpoint = function (passRequest) {
  return lookupVersionMarkers(passRequest)
    .then(optionsResponse);
};
