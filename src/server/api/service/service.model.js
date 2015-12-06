'use strict';


var mongoosePaginate = require('mongoose-paginate');

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var HeaderSchema = new Schema({
  name: String,
  value: String
});

var EndpointSchema = new Schema({
  hits: {type: Number, default: 0},
  //base
  uri: String,
  apiVersion: String,
  // full swagger path: base + apiBaseUrl
  apiBaseUrl: String,
  // http and/or https
  apiSchemes: [String],
  // url to swagger model
  apiDocUrl: String,
  // swagger model
  apiDoc: String,
  apiValid: {type: Boolean, default: false},
  headers: [HeaderSchema],
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now}
});

var ServiceSchema = new Schema({
  name: String,
  hits: {type: Number, default: 0},
  code: {type: String, unique: true, validate: /^(?!api).*$/},
  latestVersion: String,
  public: {type: Boolean, default: true},
  example: Boolean,
  provider: String,
  defaultHeaders: [HeaderSchema],
  endpoints: [EndpointSchema]
});


ServiceSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Service', ServiceSchema);
