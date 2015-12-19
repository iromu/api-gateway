/**
 * Express configuration
 */

'use strict';

var logger = require('log4js').getLogger('HTTP');

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment/index');
var passport = require('passport');
var session = require('express-session');
var sessionStore = require('../components/cache/index').getSessionStore(session);
var errorhandler = require('errorhandler');

module.exports = function (app) {
  var env = app.get('env');
  var morganFormat = 'combined';

  //app.set('views', config.root + '/server/views');

  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

  app.use(compression());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(session({
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: config.secrets.session
    }
  ));

  if ('production' === env) {
    app.use(errorhandler());
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', config.root + '/public');
  }

  if ('development' === env || 'test' === env) {
    morganFormat = 'dev';
    app.use(errorHandler({dumpExceptions: true, showStack: true}));
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '../.tmp')));
    app.use('/bower_components', express.static(path.join(config.root, '../bower_components')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', path.join(config.root, 'client'));
    app.use(errorHandler()); // Error handler - has to be last
  }

  app.use(morgan(morganFormat,
    {
      stream: {
        write: function (str) {
          logger.debug(str);
        }
      }
    }));
};
