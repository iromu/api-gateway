'use strict';

var SwaggerParser = require('swagger-parser');
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

var validatePresenceOf = function (value) {
  return value && value.length;
};
/**
 * Pre-save hook
 */
/*
 EndpointSchema
 .pre('save', function (next) {

 if (validatePresenceOf(this.apiDoc)) {
 SwaggerParser.validate(this.apiDoc)
 .then(function (api) {
 console.log("Valid API name: %s, Version: %s", api.info.title, api.info.version);
 next();
 })
 .catch(function (err) {
 next(new Error(err));
 });
 }
 else
 next();
 });
 */
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

/**
 * Validations
 */

// Validate empty email
ServiceSchema
  .path('code')
  .validate(function (code) {
    return code.length;
  }, 'Code cannot be blank');

ServiceSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Service', ServiceSchema);
