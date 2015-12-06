'use strict';

var scraper = require('../components/scraper/apigurus');

module.exports.define = function (agenda) {
  agenda.define('poll apisguru', function (job, done) {
    try {
      console.log('Start poll apisguru.');

/*

      SwaggerParser.validate(parsed)
        .then(function (api) {
          console.log("Valid API name: %s, Version: %s", api.info.title, api.info.version);
        })
        .catch(function (err) {
          return err;
        });

*/
      console.log('End poll apisguru.');
    } catch (e) {
      console.error(e);
      job.fail(e);
    }
  });
};


