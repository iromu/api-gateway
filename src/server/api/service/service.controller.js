'use strict';


var logger = require('log4js').getLogger('service.controller');

var _ = require('lodash');
var Service = require('./service.model.js');
var BaseController = require('../base.controller');
var repository = require('./service.repository');

var service = require('./service.service');

// Get list of public services
exports.public = function (req, res) {

  var filter = {};

  if (req.query.code) {
    filter.code = new RegExp(req.query.code, 'i');
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

  var MAX_SIZE = 50;
  var MIN_SIZE = 10;

  var columnDefinition;
  var columnDefinitionForListing = {'_id': 0, 'code': 1, 'name': 1, 'hits': 1, 'latestVersion': 1};
  var columnDefinitionForDetailByCode = {'_id': 0, 'code': 1, 'name': 1, 'hits': 1, 'latestVersion': 1, 'endpoints': 1};

  var limit = req.headers.size ? (req.headers.size > MAX_SIZE ? MAX_SIZE : req.headers.size) : MIN_SIZE;
  var filter = {};
  var sortBy = {};

  if (req.query.code) {
    filter.code = req.query.code;
    columnDefinition = columnDefinitionForDetailByCode;
  } else {
    columnDefinition = columnDefinitionForListing;
  }

  if (req.query.public) {
    filter.public = true;
    sortBy.hits = -1;
  }

  var request = {
    filter: filter,
    options: {
      page: req.headers.page,
      limit: limit,
      columns: columnDefinition,
      sortBy: sortBy,
      lean: true
    }
  };

  service.getPage(request)
    .then(function (response) {
      res.set(response.headers);
      return res.send(response.body);
    })
    .catch(function (error) {
      if (error) {
        return handleError(res, error);
      } else {
        return res.sendStatus(404);
      }
    })
    .done();

};

exports.typeahead = function (req, res) {
  var codeFilter = req.query.code;
  if (!codeFilter) {
    return res.status(400);
  }
  repository.typeahead(codeFilter)
    .then(function (result) {
      returnJson(res, result)
    })
    .catch(function (error) {
      handleError(res, error)
    })
};

// Get a single service
exports.show = function (req, res) {

  if (isNaN(req.params.id)) {

    var filter = {code: req.params.id};

    Service.findOne(filter)
      .lean()
      .exec(function (err, service) {
        if (err) {
          return handleError(res, err);
        }
        if (!service) {
          return res.send(404);
        }
        return res.status(200).json(service);
      });
  }
  else {

    Service.findById(req.params.id, function (err, service) {
      if (err) {
        return handleError(res, err);
      }
      if (!service) {
        return res.send(404);
      }
      return res.json(service);
    });
  }
};

exports.apiVersions = function (req, res) {

  if (isNaN(req.params.id)) {

    var filter = {code: req.params.id};

    Service.findOne(filter)
      .lean()
      .exec(function (err, service) {
        if (err) {
          return handleError(res, err);
        }
        if (!service) {
          return res.send(404);
        }
        return res.status(200).json(_.map(service.endpoints, 'apiVersion'));
      });
  }
  else {

    Service.findById(req.params.id, function (err, service) {
      if (err) {
        return handleError(res, err);
      }
      if (!service) {
        return res.send(404);
      }
      return res.json(service);
    });
  }
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
  logger.error(err);
  return res.status(500).json(err);
}

function returnJson(res, result) {
  return res.json(result);
}
