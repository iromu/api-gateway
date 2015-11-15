'use strict';

var scraper = require('../components/scraper/apigurus');

module.exports.define = function (agenda) {
  agenda.define('poll apisguru', function (job, done) {
    try {
      console.log('Start poll apisguru.');
      scraper
        .start()
        .then(function () {
          done();
        });
      console.log('End poll apisguru.');
    } catch (e) {
      console.error(e);
      job.fail(e);
    }
  });
};
