'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  portSsl: process.env.PORT_SSL || 9443,

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: process.env.SESSION_SECRET || 'api-gateway-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
      db: {
        safe: true
      }
    }
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || 'id',
    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
    callbackURL: (process.env.DOMAIN_SSL || '') + '/auth/facebook/callback'
  },

  twitter: {
    clientID: process.env.TWITTER_ID || 'id',
    clientSecret: process.env.TWITTER_SECRET || 'secret',
    callbackURL: (process.env.DOMAIN_SSL || '') + '/auth/twitter/callback'
  },

  google: {
    clientID: process.env.GOOGLE_ID || 'id',
    clientSecret: process.env.GOOGLE_SECRET || 'secret',
    callbackURL: (process.env.DOMAIN_SSL || '') + '/auth/google/callback'
  },

  github: {
    clientID: process.env.GITHUB_CLIENT_ID || 'id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'secret',
    callbackURL: (process.env.DOMAIN_SSL || '') + '/auth/github/callback'
  },

  redis: {
    purgeOnLoad: false,
    prefix: process.env.REDIS_PREFIX || 'ag:',
    uri: process.env.AWS_ELASTICACHE_URI || process.env.REDISCLOUD_URL || process.env.REDIS_URL || 'redis://localhost:6379'
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
