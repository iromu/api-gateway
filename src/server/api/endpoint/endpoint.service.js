'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Q = require('q');
var repository = require('./endpoint.repository');


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
        console.warn('Rejected EndpointService.optionsResponse. Not Found');
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
      console.info('Resolved EndpointService.optionsResponse, headers: ' + JSON.stringify(options.headers));
      deferred.resolve(options);
    }).catch(function (error) {
      console.error('Rejected EndpointService.optionsResponse');
      deferred.reject(error);
    })
    .done();

  return deferred.promise;
};


var _getEndpointModel = function (apiRequest) {


  console.info('Entering EndpointService._getEndpointModel');

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
        console.warn('Rejected EndpointService._getEndpointModel. Not Found');
        deferred.reject(undefined);
      }

      repository.updateAll({code: apiRequest.code, 'endpoints.apiVersion': apiRequest.apiVersion}, {
        $inc: {
          'endpoints.$.hits': 1,
          'hits': 1
        }
      });

      apiRequest.apiDoc = service.endpoints[0].apiDoc;
      console.info('Resolved EndpointService._getEndpointModel apiDoc? ' + (apiRequest.apiDoc ? true : false) + ', apiDocUrl: ' + apiRequest.apiDocUrl);
      deferred.resolve(apiRequest);
    }).catch(function (error) {
      console.error('Rejected EndpointService._getEndpointModel');
      deferred.reject(error);
    })
    .done();

  return deferred.promise;
};

/**
 * {code: code, apiVersion: apiVersion}
 * */
var getApiModel = function (apiRequest) {
  console.info('Entering EndpointService.getApiModel');
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
        console.warn('Rejected EndpointService.getApiModel. Not Found');
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
      apiRequest.apiDocUrl = service.endpoints[0].apiDocUrl || (service.endpoints[0].uri + '/swagger.json');

      console.info('Resolved EndpointService.getApiModel ' +
        'apiDoc? ' + (apiRequest.apiDoc ? true : false) + ', apiDocUrl: ' + apiRequest.apiDocUrl);
      deferred.resolve(apiRequest);
    }).catch(function (error) {
      console.error('Rejected EndpointService.getApiModel');
      deferred.reject(error);
    })
    .done();

  return deferred.promise;
};

var checkApiDocModel = function (apiRequest) {
  if (apiRequest.apiDoc) {
    return apiRequest;
  }
  console.info('Entering EndpointService.checkApiDocModel apiRequest.apiDocUrl:' + apiRequest.apiDocUrl);
  return repository.getApiDocModel(apiRequest);
};


/**
 * Lookup for '@latest' string to endpoint.latestVersion
 * @param apiRequest.code
 * @returns apiRequest with entry apiVersion
 * */
var lookupVersionMarkers = function (apiRequest) {
  console.info('Entering EndpointService.lookupVersionMarkers');
  var deferred = Q.defer();
  try {
    if (isLatestVersion(apiRequest.apiVersion)) {
      console.log('Step EndpointService.lookupVersionMarkers. Find lookupVersionMarkers for ' + apiRequest.code);
      var promise = repository.findOne({code: apiRequest.code});
      promise.then(function (service) {
        if (!service) {
          console.warn('Rejected EndpointService.lookupVersionMarkers. Not Found');
          deferred.reject(undefined);
        }
        apiRequest.apiVersion = service.latestVersion;
        console.info('Resolved EndpointService.lookupVersionMarkers. apiRequest.apiVersion: ' + apiRequest.apiVersion);
        deferred.resolve(apiRequest);
      }).catch(function (error) {
        console.error('Rejected EndpointService.lookupVersionMarkers');
        deferred.reject(error);
      }).done();
    } else {
      console.info('Resolved EndpointService.lookupVersionMarkers');
      deferred.resolve(apiRequest);
    }
  } catch (err) {
    console.error('Rejected EndpointService.lookupVersionMarkers');
    deferred.reject(err);
  }
  return deferred.promise;
};

var apiResponse = function (apiRequest) {
  var body = apiRequest.apiDoc;
  // Replace basePath and host to match this running server
  var match = /"basePath" *?: *?".+?" *?,/;
  body = body.replace(match, '"basePath":"/' + apiRequest.code + '",');

  var host = apiRequest.host;
  match = /"host" *?: *?".+?" *?,/;
  body = body.replace(match, '"host":"' + host + '",');

  return {headers: [], body: JSON.parse(body)};
};

exports.getApiDocument = function (apiRequest) {
  return lookupVersionMarkers(apiRequest)
    .then(getApiModel)
    .then(checkApiDocModel)
    .then(apiResponse);
};

exports.passEndpoint = function (passRequest) {
  return lookupVersionMarkers(passRequest)
    .then(optionsResponse);
};
