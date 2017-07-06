import {ApolloClient, createNetworkInterface} from "react-apollo";
import {SubscriptionClient, addGraphQLSubscriptions} from "subscriptions-transport-ws";


import {getTasksQuery} from "web/logic/graphql/app";

// let client;
const wsClient = new SubscriptionClient(process.env.GRAPHQL_WSURL, {
  reconnect: true,
  connectionCallback() {
    if (apolloClient) { // this will force a refresh if loss of connection
      return apolloClient.query({
        fetchPolicy: "network-only",
        query: getTasksQuery,
      });
    }
    return undefined;
  }
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
const apolloClient = new ApolloClient({networkInterface: networkInterfaceWithSubscriptions});

export default apolloClient;
