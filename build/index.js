"use strict";

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

var _sql2gql = require("sql2gql");

var _expect = require("expect");

var _expect2 = _interopRequireDefault(_expect);

var _graphql = require("graphql");

var _sourceMapSupport = require("source-map-support");

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_sourceMapSupport2.default.install();

const TaskModel = {
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
    }
  },
  relationships: [],
  expose: {
    classMethods: {
      mutations: {
        reverseName: {
          type: "Task",
          args: {
            input: {
              type: new _graphql.GraphQLNonNull(new _graphql.GraphQLInputObjectType({
                name: "TaskReverseNameInput",
                fields: {
                  amount: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLInt) }
                }
              }))
            }
          }
        }
      },
      query: {
        getHiddenData: {
          type: new _graphql.GraphQLObjectType({
            name: "TaskHiddenData",
            fields: () => ({
              hidden: { type: _graphql.GraphQLString }
            })
          }),
          args: {}
        }
      }
    }
  },
  classMethods: {
    getHiddenData(args, req) {
      return {
        hidden: "Hi"
      };
    }
  },
  options: {
    tableName: "tasks",
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
    ]
  }
};

const schemas = [TaskModel];

_asyncToGenerator(function* () {
  let instance = new _sequelize2.default("database", "username", "password", {
    dialect: "sqlite",
    logging: false
  });
  (0, _sql2gql.connect)(schemas, instance, {}); // this populates the sequelize instance with the appropriate models and referential information for schema generation
  yield instance.sync();
  const { Task } = instance.models;
  yield Promise.all([Task.create({
    name: "item1"
  }), Task.create({
    name: "item2"
  }), Task.create({
    name: "item3"
  })]);
  const schema = yield (0, _sql2gql.createSchema)(instance); //creates graphql schema
  const result = yield (0, _graphql.graphql)(schema, "query { models { Task { id, name } } }");
  console.log(JSON.stringify(result.data));
  return (0, _expect2.default)(result.data.models.Task.length).toEqual(3);
})();
//# sourceMappingURL=index.js.map
