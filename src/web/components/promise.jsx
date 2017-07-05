import React from "react";
import Promise from "bluebird";

export default class PromiseComponent extends React.Component {
  setStateAsync(state) {
    return Promise.fromCallback((callback) => {
      return this.setState(state, callback);
    });
  }
}
