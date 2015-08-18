/**
 * Main application file
 */

'use strict';

//add timestamps in front of log messages
require('console-stamp')(console, '[HH:MM:ss.l]');

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var fs = require('fs');
var path = require('path');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
require('./components/redis').mongooseRedisCache(mongoose);

// Populate DB with sample data
if (config.seedDB) {
  require('./config/seed');
}

// Setup server
var app = express();
var server = require('http').createServer(app);

var socketio = require('socket.io')(server, {
  serveClient: (config.env === 'production') ? false : true,
  path: '/socket.io-client'
});

require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

var options = {
  key: fs.readFileSync(path.join(__dirname, './config/cert/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, './config/cert/cert.pem')),
  requestCert: false,
  rejectUnauthorized: false
};

require('https').createServer(options, app).listen(config.port_ssl, config.ip, function () {
  console.log('Express secure server listening on %d, in %s mode', config.port_ssl, app.get('env'));
});


// Expose app
exports = module.exports = app;
