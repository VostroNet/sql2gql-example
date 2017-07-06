"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

var _graphql = require("graphql");

var _database = require("../database");

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
  name: "Task",
  define: {
    name: {
      type: _sequelize2.default.STRING,
      allowNull: false,
      validate: {
        isAlphanumeric: {
          msg: "Your task name can only use letters and numbers"
        },
        len: {
          args: [1, 50],
          msg: "Your task name must be between 1 and 50 characters"
        }
      }
    },
    options: {
      type: _sequelize2.default.STRING,
      allowNull: true
    }
  },
  before(findOptions, args, context, info) {
    return findOptions;
  },
  after(result, args, context, info) {
    return result;
  },
  override: {
    options: {
      type: {
        name: "TaskOptions",
        fields: {
          completed: { type: _graphql.GraphQLBoolean }
        }
      },
      output(result, args, context, info) {
        return JSON.parse(result.options || "{}");
      },
      input(field, args, context, info) {
        return JSON.stringify(field);
      }
    }
  },
  relationships: [{
    type: "hasMany",
    model: "TaskItem",
    name: "items"
  }],
  expose: {
    classMethods: {
      mutations: {
        complete: {
          type: "Task",
          args: {
            input: {
              type: new _graphql.GraphQLNonNull(new _graphql.GraphQLInputObjectType({
                name: "TaskCompleteInput",
                fields: {
                  id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLInt) }
                }
              }))
            }
          }
        }
      },
      query: {}
    }
  },
  options: {
    tableName: "tasks",
    classMethods: {
      complete({ input: { id } }, req) {
        return _asyncToGenerator(function* () {
          const db = yield (0, _database2.default)();
          const { Task } = db.models;
          const result = yield Task.findOne({ where: { id } });
          if (result) {
            const options = JSON.parse(result.get("options") || "{}");
            options.completed = true;
            yield result.update({
              options: JSON.stringify(options)
            }, { req });
            return result;
          }
          throw `Task ${id} not found`;
        })();
      }
    },
    hooks: {
      beforeFind(options) {
        return undefined;
      },
      beforeCreate(instance, options) {
        return undefined;
      },
      beforeUpdate(instance, options) {
        return undefined;
      },
      beforeDestroy(instance, options) {
        return undefined;
      }
    },
    indexes: [
      // {unique: true, fields: ["name"]},
    ],
    instanceMethods: {} //TODO: figure out a way to expose this on graphql
  }
};
//# sourceMappingURL=task.js.map
