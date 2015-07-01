'use strict';

var _ = require('lodash');
var Service = require('./service.model');

// Get list of public services
exports.public = function (req, res) {

  var filter = {};

  if (req.query.code) {
    filter.code = req.query.code;
  }
  if (req.query.public) {
    filter.public = {$eq: true};
  }

  Service.find(filter)
    .sort({code: +1})
    .lean()
    .exec(function (err, services) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(services);
    });

};


// Get list of services
exports.index = function (req, res) {

  var filter = {};

  if (req.query.code) {
    filter.code = req.query.code;
  }
  if (req.query.public) {
    filter.public = true;
  }

  Service.find(filter)
    .sort({public: +1})
    .sort({code: +1})
    .lean()
    .exec(function (err, services) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(services);
    });

};

// Get a single service
exports.show = function (req, res) {
  Service.findById(req.params.id, function (err, service) {
    if (err) {
      return handleError(res, err);
    }
    if (!service) {
      return res.send(404);
    }
    return res.json(service);
  });
};

// Creates a new service in the DB.
exports.create = function (req, res) {
  Service.create(req.body, function (err, service) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(service);
  });
};

// Updates an existing service in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Service.findById(req.params.id, function (err, service) {
    if (err) {
      return handleError(res, err);
    }
    if (!service) {
      return res.send(404);
    }
    var updated = _.merge(service, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(service);
    });
  });
};

// Deletes a service from the DB.
exports.destroy = function (req, res) {
  Service.findById(req.params.id, function (err, service) {
    if (err) {
      return handleError(res, err);
    }
    if (!service) {
      return res.send(404);
    }
    service.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
