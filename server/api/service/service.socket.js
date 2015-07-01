/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Service = require('./service.model');

exports.register = function (socket) {
  Service.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Service.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('service:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('service:remove', doc);
}
