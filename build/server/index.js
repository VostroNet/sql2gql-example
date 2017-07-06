"use strict";

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _sourceMapSupport = require("source-map-support");

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _graphqlServerExpress = require("graphql-server-express");

var _graphql = require("graphql");

var _subscriptionsTransportWs = require("subscriptions-transport-ws");

var _sql2gql = require("sql2gql");

var _http = require("http");

var _config = require("../../config");

var _config2 = _interopRequireDefault(_config);

var _database = require("./database");

var _database2 = _interopRequireDefault(_database);

var _session = require("./utils/session");

var _session2 = _interopRequireDefault(_session);

var _logger = require("./utils/logger");

var _logger2 = _interopRequireDefault(_logger);

require("core-js/modules/es7.string.pad-start");

require("core-js/modules/es7.string.pad-end");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//import graphqlHTTP from "express-graphql";

// import {SubscriptionManager} from "graphql-subscriptions";


const log = (0, _logger2.default)("sql2gql-example::index:");
const RedisStore = require("connect-redis")(_session2.default);
_sourceMapSupport2.default.install();
_bluebird2.default.promisifyAll(_fs2.default);

_asyncToGenerator(function* () {
  const instance = yield (0, _database2.default)();
  const schema = yield (0, _sql2gql.createSchema)(instance);
  const app = (0, _express2.default)();

  app.enable("trust proxy");
  app.use(_bodyParser2.default.urlencoded({ extended: true }));
  app.use(_bodyParser2.default.json());
  app.use(_express2.default.static(_path2.default.resolve(__dirname, "../public/")));
  app.use((0, _session2.default)({
    secret: _config2.default.express.session.secret,
    store: new RedisStore(_config2.default.express.session.redis)
  }));
  app.use((0, _cors2.default)({
    credentials: true,
    origin: function (origin, callback) {
      if (!origin || isNaN(origin)) {
        return callback(null, true);
      }
      let result = _config2.default.express.cors.origin.indexOf(origin) > -1;
      return callback(result ? null : "Bad Request", result);
    }
  }));

  app.use("/graphql", (0, _graphqlServerExpress.graphqlExpress)(function (req) {
    return {
      schema,
      context: {
        // req,
      }
    };
  }));
  if (_config2.default.graphql.graphiql) {
    app.use("/graphiql", (0, _graphqlServerExpress.graphiqlExpress)({
      endpointURL: "/graphql",
      subscriptionsEndpoint: `${_config2.default.graphql.wsHost}${_config2.default.graphql.wsPath}`,
      query: "{}"
    }));
  }

  app.use((() => {
    var _ref2 = _asyncToGenerator(function* (req, res, next) {
      const file = yield _fs2.default.readFileAsync(_path2.default.resolve(__dirname, "../public/index.html"), "utf-8");
      return res.send(file);
    });

    return function (_x, _x2, _x3) {
      return _ref2.apply(this, arguments);
    };
  })());

  const server = (0, _http.createServer)(app);
  server.listen(_config2.default.express.port, function () {
    const wsServer = new _subscriptionsTransportWs.SubscriptionServer({
      schema,
      execute: _graphql.execute,
      subscribe: _graphql.subscribe
    }, {
      server: server,
      path: _config2.default.graphql.wsPath
    });
    log.info(`server listening on port ${_config2.default.express.port}`);
  });
})();
//# sourceMappingURL=index.js.map
