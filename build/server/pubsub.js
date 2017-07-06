"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphqlRedisSubscriptions = require("graphql-redis-subscriptions");

var _config = require("../../config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphqlRedisSubscriptions.RedisPubSub({
  connection: Object.assign({}, _config2.default.redis, {
    retry_strategy: options => {
      //eslint-disable-line
      // reconnect after
      return Math.max(options.attempt * 100, 3000);
    }
  })
});
//# sourceMappingURL=pubsub.js.map
