'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger('job.apigurus');
var scraper = require('../components/scraper/apigurus');

module.exports.define = function (agenda) {
  agenda.define('poll apisguru', function (job, done) {
    try {
      logger.info('Start poll apisguru.');
      scraper
        .start()
        .then(function () {
          logger.info('End poll apisguru.');
          done();
        }).fail(function (error) {
        logger.error('FAILED ' + error);
      });
    } catch (e) {
      logger.error(e);
      job.fail(e);
    }
  });
};
