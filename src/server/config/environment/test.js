'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  // Server port
  port: process.env.PORT || 9001,

  portSsl: process.env.PORT_SSL || 9444,

  mongo: {
    uri: process.env.MONGODB_URL || 'mongodb://localhost/apigateway-test'
  }, redis: {
    uri: process.env.REDIS_URL || 'redis://localhost:6379/1'
  }
};
