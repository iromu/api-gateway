'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: process.env.MONGODB_URL || 'mongodb://localhost/apigateway-test'
  }, redis: {
    uri: process.env.REDIS_URL || 'redis://localhost:6379/1'
  }
};
