import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Threads from "./Threads";
import ThreadPage from "./ThreadPage";

export default class AuthPage extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path={"/"} exact component={Threads} />
          <Route path={"/threadpage"} component={ThreadPage} />
        </Switch>
      </Router>
    );
  }
}
