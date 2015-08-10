/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var cors = require('cors');
module.exports = function (app) {

  app.use(cors());

  // Insert routes below
  app.use('/api/services', require('./api/service'));
  app.use('/api/samples', require('./api/sample'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/:url(index.html|explorer|admin|login)')
    .get(function (req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });

  app.use('/*', require('./api/endpoint'));
};
