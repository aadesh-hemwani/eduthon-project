import React, { Component } from "react";
import "./assets/css/App.css";
import { SideBar } from "./components/SideBar";
import AuthPage from "./auth/AuthPage";
import Admin from "./Pages/admin/Admin";
export default class App extends Component {
  render() {
    let body = <AuthPage />;
    let loggedIn = localStorage.getItem("token") !== null;
    let isAdmin = localStorage.getItem("isAdmin");

    console.log(isAdmin);

    if (!loggedIn) {
      body = <AuthPage />;
    } else {
      if (isAdmin === "true") {
        body = <Admin />;
      } else {
        body = <SideBar pageName={this.setCurrentPage} />;
      }
    }

    return <div>{body}</div>;
  }
}
