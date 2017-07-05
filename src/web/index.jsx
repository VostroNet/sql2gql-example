import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import {ApolloProvider} from "react-apollo";
import {StyleRoot} from "radium";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import client from "web/logic/graphql/client";
import TaskList from "web/pages/tasks/list";

injectTapEventPlugin();
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: "#0049b0",
    primary1ColorDark: "#002380",
  },
});
const App = (<ApolloProvider client={client}>
  <StyleRoot>
    <MuiThemeProvider muiTheme={muiTheme}>
      <BrowserRouter>
        <Switch>
          <Route component={TaskList} path="/" exact />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  </StyleRoot>
</ApolloProvider>);

ReactDOM.render(App, document.getElementById("react-container"), () => {
  const loader = document.getElementById("loader");
  loader.className = "loader fadeOut";
  return setTimeout(() => {
    loader.parentNode.removeChild(loader);
  }, 500);
});
