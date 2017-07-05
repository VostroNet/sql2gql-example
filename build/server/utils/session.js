"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_expressSession2.default.Session.prototype);
exports.default = _expressSession2.default;
//# sourceMappingURL=session.js.map
