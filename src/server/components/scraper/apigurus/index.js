'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var http = require('http');
var https = require('https');
var Q = require('q');

var Service = require('../../../api/service/service.model.js');


function saveServices(services) {
  Service.create(services,
    function () {
      console.log('finished populating ' + services.length + ' services from seed/api-models.json');
    }
  );
}


function loadSwaggerModel(url, apiModel) {
  var deferred = Q.defer();

  var hash = require('crypto').createHmac('sha1', 'swaggerKey').update(url).digest('hex');
  var swaggerFile = path.join(__dirname, 'cache/' + hash + '.json');

  fs.readFile(swaggerFile, function (err, swaggerContent) {
    if (err || swaggerContent === 'null') {
      console.log('Loading Swagger from ' + url);
      pullSwaggerConfigFrom(url).then(function (swaggerContent) {
        fs.writeFile(swaggerFile, JSON.stringify(swaggerContent), function (err) {
          if (err) deferred.reject(err);
          //var json = JSON.parse(swaggerContent);
          swaggerContent.apiModel = apiModel;
          deferred.resolve(swaggerContent);
        });
      }).fail(function (error) {
        console.error('FAILED ' + error);
      });
    }
    else {
      var json = JSON.parse(swaggerContent);
      if (json) json.apiModel = apiModel;
      deferred.resolve(json);
    }
  });
  return deferred.promise;
}

function pullSwaggerConfigFrom(url) {
  var deferred = Q.defer();
  var request = (url.startsWith('http://')) ? http : https;
  request.get(url, function (res) {
    res.setEncoding('utf8');
    var body = '';
    res.on('data', function (d) {
      body += d;
    });
    res.on('end', function () {
      try {
        var parsed = JSON.parse(body);
      } catch (err) {
        console.error('pullSwaggerConfigFrom: Unable to parse response as JSON', err);
        console.error('pullSwaggerConfigFrom: ', body);
        deferred.reject(err);
      }
      deferred.resolve(parsed);
    });
  }).on('error', function (err) {
    console.error('Error with the request:', err.message);
    deferred.reject(err);
  });
  return deferred.promise;
}

function onSwaggerModelLoaded(swaggerModel) {

  /*
   SwaggerParser.validate(parsed)
   .then(function (api) {
   console.log("Valid API name: %s, Version: %s", api.info.title, api.info.version);
   })
   .catch(function (err) {
   return err;
   });

   */

  //console.log(swaggerModel.apiModel.versions[swaggerModel.info.version].swaggerUrl);
  return {//endpointModel
    hits: 0,
    uri: swaggerModel.schemes[0] + '://' + swaggerModel.host + (swaggerModel.basePath || ''),
    apiDocUrl: swaggerModel.info['x-origin'].url || swaggerModel.apiModel.versions[swaggerModel.info.version].swaggerUrl,
    apiDoc: JSON.stringify(swaggerModel),
    apiDocValid: undefined,
    apiVersion: swaggerModel.info.version,
    headers: undefined,
    apiModel: swaggerModel.apiModel
  };
};


module.exports.start = function () {
  var deferred = Q.defer();
  Service.find({provider: 'apis.guru'}).remove(function () {
    console.log('Reading seed/api-models.json');

    fs.readFile(path.join(__dirname, 'seed/api-models.json'), function (err, content) {
      if (err) throw err;

      var apiModels = JSON.parse(content);
      var allPromises = [];

      for (var apiModelKey in apiModels) {

        //console.log('Loading info for ' + apiModelKey);

        var headerModelList = undefined;
        var apiModel = apiModels[apiModelKey];
        apiModel.apiModelKey = apiModelKey;
        var versions = apiModel.versions;
        var loadSwaggerPromises = [];

        for (var version in versions) {
          var promise = loadSwaggerModel(versions[version].swaggerUrl, apiModel).then(onSwaggerModelLoaded);
          loadSwaggerPromises.push(promise);
        }

        var onAllSwaggerModelLoaded = function (endpointModelList) {
          var apiModel = endpointModelList[0].apiModel;
          //console.log('finished retrieving ' + endpointModelList.length + ' endpoints for ' + apiModel.apiModelKey);
          var serviceModel = {
            name: apiModel.apiModelKey,
            //hits: 0,
            code: apiModel.apiModelKey,
            latestVersion: apiModel.preferred,
            public: true,
            //example:false,
            provider: 'apis.guru',
            defaultHeaders: headerModelList,
            endpoints: endpointModelList
          };
          return serviceModel;
        };

        //Run in parallel
        allPromises.push(Q.all(loadSwaggerPromises).then(onAllSwaggerModelLoaded, console.error));

        //console.log('Finished registering loading info for ' + apiModelKey);
      }
      deferred.resolve(Q.all(allPromises).then(saveServices));

    });
  });
  return deferred.promise;
};
