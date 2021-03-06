'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: process.env.MONGODB_URL || 'mongodb://localhost/apigateway-dev'
  },

  redis: {
    purgeOnLoad: true,
    prefix: process.env.REDIS_PREFIX || 'ag-dev:',
    uri: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  seedDB: true
};
