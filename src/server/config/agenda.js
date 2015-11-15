'use strict';

var config = require('./environment/index');
var Agenda = require('agenda');

module.exports = function (app) {
  console.info('Entering Config/Agenda');

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
    agenda.schedule('in 10 seconds', 'poll apisguru', {time: new Date()});
    if ('test' !== env) {
      agenda.start();
    }
  });

  return agenda;
};
