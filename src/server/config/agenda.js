'use strict';

var config = require('./environment/index');
var Agenda = require('agenda');

module.exports = function (app) {
  var env = app.get('env');
  var agenda = new Agenda({db: {address: config.mongo.uri}});

  try {
    require('../jobs/apisguru.job').define(agenda);
  } catch (e) {
    console.error(e);
  }

  agenda.on('start', function (job) {
    console.log("Job %s starting", job.attrs.name);
  });
  agenda.on('complete', function (job) {
    console.log("Job %s finished", job.attrs.name);
  });
  agenda.on('ready', function () {
    if ('development' === env) {
      agenda.schedule('in 10 seconds', 'poll apisguru', {time: new Date()});

      //run every night at 2:30
      agenda.every('30 2 * * *', ['poll apisguru']);
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
      console.error(e);
      process.exit(0);
    }
  }

  process.on('SIGTERM', graceful);
  process.on('SIGINT', graceful);

  return agenda;
};
