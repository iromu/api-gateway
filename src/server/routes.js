/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors/index');
var cors = require('cors');
module.exports = function (app) {

  app.use(cors());

  app.use('/api/services', require('./api/service/index'));
  app.use('/api/samples', require('./api/sample/index'));
  app.use('/api/users', require('./api/user/index'));
  app.use('/auth', require('./auth/index'));
  app.use('/-/*', require('./api/endpoint/index'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
