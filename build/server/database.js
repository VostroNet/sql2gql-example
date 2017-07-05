"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

var _sql2gql = require("sql2gql");

var _logger = require("./utils/logger");

var _logger2 = _interopRequireDefault(_logger);

var _models = require("./models");

var _models2 = _interopRequireDefault(_models);

var _config = require("../../config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const log = (0, _logger2.default)("sql2gql-example::database:");

function createInstance() {
  const { username, password, database, debug, sync, options } = _config2.default.sequelize;
  const db = new _sequelize2.default(database, username, password, Object.assign({}, options, {
    logging: args => {
      if (debug) {
        log.info(args);
      }
    }
  }));
  (0, _sql2gql.connect)(_models2.default, db, {});
  return db.sync(sync);
}

let instance; //singleton

exports.default = (() => {
  var _ref = _asyncToGenerator(function* () {
    if (instance) {
      return instance;
    }
    instance = yield createInstance();
    return instance;
  });

  function getDatabase() {
    return _ref.apply(this, arguments);
  }

  return getDatabase;
})();
//# sourceMappingURL=database.js.map
