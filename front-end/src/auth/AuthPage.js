import React, { Component } from "react";
import Register from "./Register";
import Login from "./Login";
import { SideBar } from "../components/SideBar";
import ForgotPassword from "./ForgotPassword";
import Admin from "../Pages/admin/Admin";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

export default class AuthPage extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path={"/admin"} exact component={Admin} />
          <Route path={"/login"} exact component={Login} />
          <Route path={"/forgotPassword"} exact component={ForgotPassword} />
          <Route path={"/register"} exact component={Register} />
          <Route path={"/"} exact component={SideBar} />
        </Switch>
      </Router>
    );
  }
}
