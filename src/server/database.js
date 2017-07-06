import Sequelize from "sequelize";
import {connect} from "sql2gql";

import logger from "server/utils/logger";
import models from "server/models";
import config from "config";
const log = logger("sql2gql-example::database:");

import pubsub from "./pubsub";


function createInstance() {
  const {username, password, database, debug, sync, options} = config.sequelize;
  const db = new Sequelize(database, username, password, Object.assign({}, options, {
    logging: (args) => {
      if (debug) {
        log.info(args);
      }
    },
  }));
  connect(models, db, {subscriptions: {pubsub}});
  return db.sync(sync);
}


let instance; //singleton
export default async function getDatabase() {
  if (instance) {
    return instance;
  }
  instance = await createInstance();
  return instance;
}

