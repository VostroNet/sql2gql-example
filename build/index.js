"use strict";

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

var _sql2gql = require("sql2gql");

var _expect = require("expect");

var _expect2 = _interopRequireDefault(_expect);

var _graphql = require("graphql");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
    },
    options: {
      type: _sequelize2.default.STRING,
      allowNull: true
    }
  },
  before(findOptions, args, context, info) {
    // console.log("before", arguments);
    return findOptions;
  },
  after(result, args, context, info) {
    // console.log("after", result);
    return result;
  },
  override: {
    options: {
      type: {
        name: "TaskOptions",
        fields: {
          hidden: { type: _graphql.GraphQLString }
        }
      },
      output(result, args, context, info) {
        return JSON.parse(result.get("options"));
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
        },
        getHiddenData2: {
          type: new _graphql.GraphQLObjectType({
            name: "TaskHiddenData2",
            fields: () => ({
              hidden: { type: _graphql.GraphQLString }
            })
          }),
          args: {}
        }
      }
    }
  },
  options: {
    tableName: "tasks",
    classMethods: {
      reverseName({ input: { amount } }, req) {
        return {
          id: 1,
          name: `reverseName${amount}`
        };
      },
      getHiddenData(args, req) {
        return {
          hidden: "Hi"
        };
      },
      getHiddenData2(args, req) {
        return {
          hidden: "Hi2"
        };
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
    ]
    //instanceMethods: {}, //TODO: figure out a way to expose this on graphql
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

  const schema = yield (0, _sql2gql.createSchema)(instance); //creates graphql schema
  const mutation = `mutation {
    models {
      Task {
        create(input: {name: "item1", options: {hidden: "nowhere"}}) {
          id, 
          name
          options {
            hidden
          }
        }
      }
    }
  }`; // create item in database
  const mutationResult = yield (0, _graphql.graphql)(schema, mutation);
  (0, _expect2.default)(mutationResult.data.models.Task.create.options.hidden).toEqual("nowhere");
  const queryResult = yield (0, _graphql.graphql)(schema, "query { models { Task { id, name, options {hidden} } } }"); // retrieves information from database
  return (0, _expect2.default)(queryResult.data.models.Task[0].options.hidden).toEqual("nowhere");
})();
//# sourceMappingURL=index.js.map
