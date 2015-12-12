/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var logger = require('log4js').getLogger('service.socket');
var Service = require('./service.model.js');

exports.register = function (socket) {
  Service.schema.post('save', function (doc, cb) {
    onSave(socket, doc, cb);
  });
  Service.schema.post('remove', function (doc, cb) {
    onRemove(socket, doc, cb);
  });
};

function onSave(socket, doc, cb) {
  logger.debug('this fired after a document was saved');
  socket.emit('service:save', doc);
}

function onRemove(socket, doc, cb) {
  logger.debug('this fired after a document was removed');
  socket.emit('service:remove', doc);
}


