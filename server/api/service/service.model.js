'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var HeaderSchema = new Schema({
  name: String,
  value: String
});

var EndpointSchema = new Schema({
  hits: {type: Number, default: 0},
  uri: String,
  apiVersion: String,
  headers: [HeaderSchema]
});

var ServiceSchema = new Schema({
  name: String,
  hits: {type: Number, default: 0},
  code: {type: String, unique: true, validate: /^(?!api).*$/},
  latestVersion: String,
  public: {type: Boolean, default: true},
  example: Boolean,
  defaultHeaders: [HeaderSchema],
  endpoints: [EndpointSchema]
});

module.exports = mongoose.model('Service', ServiceSchema);
