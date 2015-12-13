'use strict';

var logger = require('log4js').getLogger('job.apigurus');
var scraper = require('../components/scraper/apigurus');

module.exports.define = function (agenda) {
  agenda.define('poll apisguru', function (job, done) {
    try {
      logger.info('Start poll apisguru.');
      scraper
        .start()
        .then(function () {
          done();
        });
      logger.info('End poll apisguru.');
    } catch (e) {
      logger.error(e);
      job.fail(e);
    }
  });
};
