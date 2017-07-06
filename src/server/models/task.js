import Sequelize from "sequelize";

import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLInt,
} from "graphql";

import getDatabase from "server/database";


export default {
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
          completed: {type: GraphQLBoolean},
        },
      },
      output(result, args, context, info) {
        return JSON.parse(result.options || "{}");
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
        complete: {
          type: "Task",
          args: {
            input: {
              type: new GraphQLNonNull(new GraphQLInputObjectType({
                name: "TaskCompleteInput",
                fields: {
                  id: {type: new GraphQLNonNull(GraphQLInt)},
                },
              })),
            },
          },
        },
      },
      query: {
      },
    },
  },
  options: {
    tableName: "tasks",
    classMethods: {
      async complete({input: {id}}, req) {
        const db = await getDatabase();
        const {Task} = db.models;
        const result = await Task.findOne({where: {id}});
        if (result) {
          const options = JSON.parse(result.get("options") || "{}");
          options.completed = true;
          await result.update({
            options: JSON.stringify(options),
          }, {req});
          return result;
        }
        throw `Task ${id} not found`;
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
    instanceMethods: {}, //TODO: figure out a way to expose this on graphql
  },
};
