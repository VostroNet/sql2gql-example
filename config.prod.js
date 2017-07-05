module.exports = {
  express: {
    port: process.env.VIRTUAL_PORT || 4081,
    cors: {
      origin: (process.env.HOST) ? process.env.HOST.split(",") : [],
    },
    session: {
      secret: process.env.SESSION_KEY || "123abc",
      redis: {
        host: process.env.REDIS_HOST || "redis",
        port: process.env.REDIS_PORT || "6379",
      },
    },
  },
  redis: {
    host: process.env.REDIS_HOST || "redis",
    port: process.env.REDIS_PORT || "6379",
  },
  graphiql: (process.env.GRAPHIQL !== undefined) ? (process.env.GRAPHIQL === "true") : true,
  sequelize: {
    username: process.env.DATABASE_USER || "username",
    password: process.env.DATABASE_PASSWORD || "password",
    database: process.env.DATABASE_NAME || "database",
    debug: (process.env.SQL_DEBUG !== undefined) ? (process.env.SQL_DEBUG === "true") : true,
    sync: {
      force: false,
    },
    options: {
      dialect: process.env.DATABASE_DIALECT || "sqlite",
      host: process.env.DATABASE_HOST,
      pool: {
        max: 20,
        min: 0,
        idle: 10000,
      },
      paranoid: true,
      timestamps: true,
    },
  },
};

module.exports.default = module.exports;
