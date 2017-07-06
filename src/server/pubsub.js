import {RedisPubSub} from "graphql-redis-subscriptions";
import config from "config";

export default new RedisPubSub({
  connection: Object.assign({}, config.redis, {
    retry_strategy: options => { //eslint-disable-line
      // reconnect after
      return Math.max(options.attempt * 100, 3000);
    },
  }),
});
