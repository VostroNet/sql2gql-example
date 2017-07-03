
import Sequelize from "sequelize";
import {connect, createSchema} from "sql2gql";
import expect from "expect";
import {
  graphql,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLInt,
} from "graphql";
import sourceMapSupport from "source-map-support";
sourceMapSupport.install();

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
  },
  relationships: [],
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
      },
    },
  },
  classMethods: {
    getHiddenData(args, req) {
      return {
        hidden: "Hi",
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
      },
    },
    indexes: [
      // {unique: true, fields: ["name"]},
    ],
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
  const {Task} = instance.models;
  await Promise.all([
    Task.create({
      name: "item1",
    }),
    Task.create({
      name: "item2",
    }),
    Task.create({
      name: "item3",
    }),
  ]);
  const schema = await createSchema(instance); //creates graphql schema
  const result = await graphql(schema, "query { models { Task { id, name } } }");
  console.log(JSON.stringify(result.data));
  return expect(result.data.models.Task.length).toEqual(3);
})();