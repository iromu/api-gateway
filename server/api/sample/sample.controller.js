'use strict';

exports.v1 = function (req, res) {
  return res.status(200).json({message: 'Hello world', version: '1.0.1'});
};

exports.v2 = function (req, res) {
  return res.status(200).json({message: 'Hello world', version: '2.0.0'});
};
