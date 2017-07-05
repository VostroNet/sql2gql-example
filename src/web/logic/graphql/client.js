import {ApolloClient, createNetworkInterface} from "react-apollo";
import {SubscriptionClient, addGraphQLSubscriptions} from "subscriptions-transport-ws";

const wsClient = new SubscriptionClient(`ws://${location.host}/subscriptions`, {
  reconnect: true,
});

const networkInterface = createNetworkInterface({
  uri: "/graphql",
  opts: {
    credentials: "include",
  },
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

export default new ApolloClient({networkInterface: networkInterfaceWithSubscriptions});
