import React, { Component } from "react";
import AuthPage from "./auth/AuthPage";

export default class App extends Component {
  render() {
    let body = <AuthPage />;
    let loggedIn = localStorage.getItem("token") !== null;

    if (!loggedIn) {
      body = <AuthPage />;
    }

    return <div>{body}</div>;
  }
}
