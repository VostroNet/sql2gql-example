import Sequelize from "sequelize";
import {connect, createSchema} from "sql2gql";
import expect from "expect";
import {
  graphql,
  GraphQLString,
  GraphQLNonNull,
  // GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLInt,
} from "graphql";

const TaskModel = {
  name: "Task",
  define: {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isAlphanumeric: {
          msg: "Your task name can only use letters and numbers",
        },
        len: {
          args: [1, 50],
          msg: "Your task name must be between 1 and 50 characters",
        },
      },
    },
    options: {
      type: Sequelize.STRING,
      allowNull: true,
    },
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
          hidden: {type: GraphQLString},
        },
      },
      output(result, args, context, info) {
        return JSON.parse(result.get("options"));
      },
      input(field, args, context, info) {
        return JSON.stringify(field);
      },
    },
  },
  relationships: [{
    type: "hasMany",
    model: "TaskItem",
    name: "items",
  }],
  expose: {
    classMethods: {
      mutations: {
        reverseName: {
          type: "Task",
          args: {
            input: {
              type: new GraphQLNonNull(new GraphQLInputObjectType({
                name: "TaskReverseNameInput",
                fields: {
                  amount: {type: new GraphQLNonNull(GraphQLInt)},
                },
              })),
            },
          },
        },
      },
      query: {
        getHiddenData: {
          type: new GraphQLObjectType({
            name: "TaskHiddenData",
            fields: () => ({
              hidden: {type: GraphQLString},
            }),
          }),
          args: {},
        },
        getHiddenData2: {
          type: new GraphQLObjectType({
            name: "TaskHiddenData2",
            fields: () => ({
              hidden: {type: GraphQLString},
            }),
          }),
          args: {},
        },
      },
    },
  },
  options: {
    tableName: "tasks",
    classMethods: {
      reverseName({input: {amount}}, req) {
        return {
          id: 1,
          name: `reverseName${amount}`,
        };
      },
      getHiddenData(args, req) {
        return {
          hidden: "Hi",
        };
      },
      getHiddenData2(args, req) {
        return {
          hidden: "Hi2",
        };
      },
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
      },
    },
    indexes: [
      // {unique: true, fields: ["name"]},
    ],
    //instanceMethods: {}, //TODO: figure out a way to expose this on graphql
  },
};


const schemas = [TaskModel];

(async() => {
  let instance = new Sequelize("database", "username", "password", {
    dialect: "sqlite",
    logging: false
  });
  connect(schemas, instance, {}); // this populates the sequelize instance with the appropriate models and referential information for schema generation
  await instance.sync();

  const schema = await createSchema(instance); //creates graphql schema
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
  const mutationResult = await graphql(schema, mutation);
  expect(mutationResult.data.models.Task.create.options.hidden).toEqual("nowhere");
  const queryResult = await graphql(schema, "query { models { Task { id, name, options {hidden} } } }"); // retrieves information from database
  return expect(queryResult.data.models.Task[0].options.hidden).toEqual("nowhere");
})();
