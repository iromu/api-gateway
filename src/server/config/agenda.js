'use strict';

var logger = require('log4js').getLogger('agenda');

var config = require('./environment/index');
var Agenda = require('agenda');

module.exports = function (app, socketio) {
  var env = app.get('env');
  var agenda = new Agenda({db: {address: config.mongo.uri}});

  socketio.on('connection', function (socket) {

    try {
      require('../jobs/topServices.job').define(agenda, socket);
    } catch (e) {
      logger.error(e);
    }

  });

  try {
    require('../jobs/apisguru.job').define(agenda);
  } catch (e) {
    logger.error(e);
  }

  agenda.on('start', function (job) {
    logger.info("Job %s starting", job.attrs.name);
  });
  agenda.on('complete', function (job) {
    logger.info("Job %s finished", job.attrs.name);
  });
  agenda.on('ready', function () {
    if ('development' === env) {
      agenda.schedule('in 10 seconds', 'poll apisguru', {time: new Date()});

      //run every night at 2:30
      agenda.every('30 2 * * *', ['poll apisguru']);

      agenda.every('10 seconds', 'topServices');

    }
    if ('test' !== env) {
      agenda.start();
    }
  });

  function graceful() {
    try {
      agenda.stop(function () {
        process.exit(0);
      });
    } catch (e) {
      logger.error(e);
      process.exit(0);
    }
  }

  process.on('SIGTERM', graceful);
  process.on('SIGINT', graceful);

  return agenda;
};
