'use strict';

var logger = require('log4js').getLogger('job.topService');

var Service = require('../api/service/service.model');

module.exports.define = function (agenda, socket) {
  agenda.define('topServices', function (job, done) {

    var handleError = function (e) {
      logger.error(e);
      job.fail(e);
    };

    try {
      var buildPaginationResponse = function (data) {
        //Service.count(function (err, count) {
        //res.setHeader('total', count);
        //return res.status(200).json(data);
        socket.emit('topServices:refresh', data);
        logger.debug('End topServices.');
        done();
        //});
      };

      var paginateCallback = function (err, data) {
        if (err) {
          return handleError(err);
        }
        buildPaginationResponse(data);
      };

      logger.debug('Start topServices.');

      var MIN_SIZE = 10;

      var columnDefinition = {'_id': 0, 'code': 1, 'name': 1, 'hits': 1, 'latestVersion': 1};
      var filter = {};
      var sortBy = {};

      filter.public = true;
      sortBy.hits = -1;

      Service.paginate(filter, {
        page: 0,
        limit: MIN_SIZE,
        columns: columnDefinition,
        sortBy: sortBy,
        lean: true
      }, paginateCallback);


    } catch (e) {
      handleError(e);
    }
  });
};
