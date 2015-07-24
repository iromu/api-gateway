'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var EndpointSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  public: Boolean,
  uri: String,
  apiVersion: String
});
var ServiceSchema = new Schema({
  name: String,
  code: String,
  info: String,
  latestVersion: String,
  public: Boolean,
  active: Boolean,
  example: Boolean,
  endpoints: [EndpointSchema]

});

module.exports = mongoose.model('Service', ServiceSchema);
