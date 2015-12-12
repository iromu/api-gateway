(function () {
  'use strict';

  var logger = require('log4js').getLogger('cache');

  var config = require('../../config/environment/index');
  var redis = require('redis');
  var bluebird = require('bluebird');

  bluebird.promisifyAll(redis.RedisClient.prototype);
  bluebird.promisifyAll(redis.Multi.prototype);

  var redisConf = require('redis-url').parse(config.redis.uri);
  var redisClient;
  var cacheClient;
  var redisStore;

  var newClient = function (options) {
    logger.debug('Redis connecting to ' + redisConf.hostname + ':' + redisConf.port);
    var redisClient = redis.createClient(redisConf.port, redisConf.hostname, options);
    if (redisConf.password) {
      redisClient.auth(redisConf.password, function (err) {
        if (err) throw err;
      });
    }
    redisClient.on('connect', function () {
      logger.debug('Redis connected to ' + redisConf.hostname + ':' + redisConf.port);
    });
    redisClient.on('error', function (err) {
      logger.debug('Redis error ' + err);
    });
    return redisClient;
  };

  var getRedisClient = function () {
    if (redisClient === undefined) {
      redisClient = newClient();
    }
    return redisClient;
  };

  var cacheClientBuilder = function (param) {
    var client = param.client;
    var prefix = param.prefix;

    return {
      get: function (key) {
        return client.getAsync(prefix + key);
      },
      set: function (key, data, ttl) {
        if (ttl && ttl > 0) {
          return client.setexAsync(prefix + key, ttl, data);
        } else {
          return client.setAsync(prefix + key, data);
        }
      },
      purge: function () {
        return new Promise(function (resolve, reject) {
          logger.debug('Purge all keys ' + prefix + '*');
          client.keys(prefix + '*', function (err, keys) {
            if (keys && keys.length < 1) return reject();

            client.del(keys, function (err, count) {
              count = count || 0;
              resolve(count);
            });
          });
        });
      }
    }
  };

  var getCacheClient = function () {
    if (cacheClient === undefined) {
      cacheClient = cacheClientBuilder({
        client: getRedisClient(),
        prefix: config.redis.prefix
      });

      if (config.redis.purgeOnLoad) {
        getRedisClient().on('connect', function () {
          cacheClient.purge();
        });
      }
    }
    return cacheClient;
  };


  var getSessionStore = function (session) {
    if (redisStore === undefined) {
      var RedisStore = require('connect-redis')(session);
      redisStore = new RedisStore({
        client: getRedisClient(),
        prefix: config.redis.prefix + 'session:'
      });
    }
    return redisStore;
  };

  module.exports.redisClient = undefined;
  module.exports.getRedisClient = getRedisClient;
  module.exports.getSessionStore = getSessionStore;
  module.exports.getCacheClient = getCacheClient;
  module.exports.createClient = newClient;

}());
