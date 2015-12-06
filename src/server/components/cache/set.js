var debug = require('debug')('redis-cache-client:set');

exports = module.exports = function(client, prefix) {
  return function(key, data, ttl, callback) {
    var input;
    callback = callback || defaultCallback;

    if (!key) return callback('no key supplied for cache set');
    if (!data) return callback('no data rupplied for cache set');

    try {
      input = JSON.stringify(data);
    } catch (e) {
      return callback('error on JSON.stringify: ' + e);
    }

    if (ttl && ttl > 0) {
      client.setex(prefix + key, ttl, input, function(err, reply) {
        if (err) {
          callback(err);
        } else if (!reply) {
          callback('redis: no reply on setex');
        } else {
          callback(null, 'redis reply on setex: ' + reply);
        }
      });
    } else {
      client.set(prefix + key, input, function(err, reply) {
        if (err) {
          callback(err);
        } else if (!reply) {
          callback('redis: no reply on set');
        } else {
          callback(null, 'redis reply on set: ' + reply);
        }
      });
    }


  }
}

function defaultCallback(err) {
  if (err) debug(err);
}
