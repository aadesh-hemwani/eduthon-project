import React from "react";

import Contact from "../Pages/Contact";
import About from "../Pages/About";
import Home from "../Pages/Home";
import FileUpload from "../Pages/FileUpload";
import EditProfile from "../Pages/EditProfile";
import ThreadRoutes from "../Pages/thread/ThreadRoutes";
import Assignment from "../Pages/classroom/Assignment";

import { withRouter } from "react-router-dom";
import Classroom from "../Pages/classroom/Classroom";

export class SideBar extends React.Component {
  state = {
    sidebarOn: true,
    sideBarClass: "sb-nav-fixed",
    currentPage: "home",
  };

  handleLogout = (e) => {
    localStorage.clear();
    localStorage.setItem("isLoggedIn", false);
    window.location.replace("/login");
  };

  handleClick = (e) => {
    e.preventDefault();
    this.setState({
      currentPage: e.target.name,
    });
  };

  handleSideBarVisibility = () => {
    if (this.state.sidebarOn) {
      this.setState({
        sidebarOn: false,
        sideBarClass: "sb-nav-fixed sb-sidenav-toggled",
      });
    } else {
      this.setState({
        sidebarOn: true,
        sideBarClass: "sb-nav-fixed",
      });
    }
  };

  render() {
    let loggedIn = localStorage.getItem("token") !== null;

    if (!loggedIn) {
      this.props.history.push("/login");
    } else {
      localStorage.setItem("isLoggedIn", true);
    }

    let page = <Home />;
    switch (this.state.currentPage) {
      case "contact":
        page = <Contact />;
        break;

      case "about":
        page = <About />;
        break;

      case "upload":
        page = <FileUpload />;
        break;

      case "editProfile":
        page = <EditProfile />;
        break;

      case "threads":
        page = <ThreadRoutes />;
        break;

      case "classroom":
        page = <Classroom />;
        break;

      case "assignment":
        page = <Assignment />;
        break;

      default:
        page = <Home />;
    }

    return (
      <div className={this.state.sideBarClass}>
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
          <button
            className="navbar-brand"
            name="home"
            onClick={this.handleClick}
          >
            APP Name
          </button>
          <button
            className="btn btn-link btn-sm order-1 order-lg-0"
            id="sidebarToggle"
            onClick={this.handleSideBarVisibility}
          >
            <i className="fas fa-bars"></i>
          </button>

          <div className="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0"></div>
          <ul className="navbar-nav ml-auto ml-md-0">
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                id="userDropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fas fa-user fa-fw"></i>
              </button>
              <div
                className="dropdown-menu dropdown-menu-right"
                aria-labelledby="userDropdown"
              >
                <button
                  onClick={this.handleClick}
                  name="editProfile"
                  className="dropdown-item"
                >
                  Edit Profile
                </button>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item bg-danger text-light"
                  name="logout"
                  onClick={this.handleLogout}
                >
                  Logout
                </button>
              </div>
            </li>
          </ul>
        </nav>

        <div id="layoutSidenav">
          <div id="layoutSidenav_nav">
            <nav
              className="sb-sidenav accordion sb-sidenav-dark"
              id="sidenavAccordion"
            >
              <div className="sb-sidenav-menu">
                <div className="nav">
                  <div className="sb-sidenav-menu-heading">Account</div>
                  <button
                    className="nav-link"
                    onClick={this.handleClick}
                    name="home"
                  >
                    <div className="sb-nav-link-icon">
                      <i className="fas fa-user"></i>
                    </div>
                    Profile
                  </button>
                  {/* <button
                    className="nav-link"
                    onClick={this.handleClick}
                    name="upload"
                  >
                    <div className="sb-nav-link-icon">
                      <i className="fas fa-upload"></i>
                    </div>
                    File Upload
                  </button> */}
                  <button
                    className="nav-link"
                    onClick={this.handleClick}
                    name="classroom"
                  >
                    <div className="sb-nav-link-icon">
                      <i className="fas fa-graduation-cap"></i>
                    </div>
                    Classroom
                  </button>
                  <button
                    className="nav-link"
                    onClick={this.handleClick}
                    name="threads"
                  >
                    <div className="sb-nav-link-icon">
                      <i className="fas fa-comment"></i>
                    </div>
                    Threads
                  </button>
                  <button
                    className="nav-link"
                    onClick={this.handleClick}
                    name="assignment"
                  >
                    <div className="sb-nav-link-icon">
                      <i className="fas fa-comment"></i>
                    </div>
                    Assignment
                  </button>

                  <button
                    className="nav-link"
                    onClick={this.handleClick}
                    name="about"
                  >
                    <div className="sb-nav-link-icon">
                      <i className="fas fa-info-circle"></i>
                    </div>
                    About
                  </button>
                </div>
              </div>
              <div className="sb-sidenav-footer">
                <div className="small">Logged in as:</div>
                {localStorage.getItem("email")}
              </div>
            </nav>
          </div>
          <div id="layoutSidenav_content">
            <main>
              <div>{page}</div>
            </main>
            <footer className="py-4 bg-light mt-auto">
              <div className="container-fluid">
                <div className="d-flex align-items-center justify-content-between small">
                  <div className="text-muted">
                    Copyright &copy; Your Website 2020
                  </div>
                  <div>
                    <button>Privacy Policy</button>
                    &middot;
                    <button>Terms &amp; Conditions</button>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(SideBar);
