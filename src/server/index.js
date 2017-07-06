import Promise from "bluebird";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import sourceMapSupport from "source-map-support";
import fs from "fs";
//import graphqlHTTP from "express-graphql";

import { graphqlExpress, graphiqlExpress } from "graphql-server-express";

import {execute, subscribe} from "graphql";
import {SubscriptionServer} from "subscriptions-transport-ws";
// import {SubscriptionManager} from "graphql-subscriptions";
import {createSchema} from "sql2gql";
import {createServer} from "http";

import config from "config";
import getDatabase from "server/database";
import session from "server/utils/session";
import logger from "server/utils/logger";

import "babel-polyfill";

const log = logger("sql2gql-example::index:");
const RedisStore = require("connect-redis")(session);
sourceMapSupport.install();
Promise.promisifyAll(fs);


(async() => {
  const instance = await getDatabase();
  const schema = await createSchema(instance);
  const app = express();

  app.enable("trust proxy");
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(path.resolve(__dirname, "../public/")));
  app.use(session({
    secret: config.express.session.secret,
    store: new RedisStore(config.express.session.redis),
  }));
  app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || isNaN(origin)) {
        return callback(null, true);
      }
      let result = config.express.cors.origin.indexOf(origin) > -1;
      return callback(result ? null : "Bad Request", result);
    },
  }));

  app.use("/graphql", graphqlExpress((req) => {
    return {
      schema,
      context: {
        // req,
      },
    };
  }));
  if (config.graphql.graphiql) {
    app.use("/graphiql", graphiqlExpress({
      endpointURL: "/graphql",
      subscriptionsEndpoint: `${config.graphql.wsHost}${config.graphql.wsPath}`,
      query: "{}",
    }));
  }

  app.use(async(req, res, next) => {
    const file = await fs.readFileAsync(path.resolve(__dirname, "../public/index.html"), "utf-8");
    return res.send(file);
  });

  const server = createServer(app);
  server.listen(config.express.port, () => {
    const wsServer = new SubscriptionServer({
      schema,
      execute,
      subscribe,
    }, {
      server: server,
      path: config.graphql.wsPath,
    });
    log.info(`server listening on port ${config.express.port}`);
  });
})();
