import React, { Component } from "react";
import Register from "./Register";
import Login from "./Login";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

export default class AuthPage extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path={"/login"} exact component={Login} />
          <Route path={"/register"} component={Register} />
        </Switch>
      </Router>
    );
  }
}
