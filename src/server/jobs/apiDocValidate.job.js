'use strict';


var logger = require('log4js').getLogger('job.apiDocValidate');

module.exports.define = function (agenda) {
  agenda.define('poll apisguru', function (job, done) {
    try {
      logger.debug('Start poll apisguru.');

/*

      SwaggerParser.validate(parsed)
        .then(function (api) {
          logger.debug("Valid API name: %s, Version: %s", api.info.title, api.info.version);
        })
        .catch(function (err) {
          return err;
        });

*/
      logger.debug('End poll apisguru.');
    } catch (e) {
      logger.error(e);
      job.fail(e);
    }
  });
};


