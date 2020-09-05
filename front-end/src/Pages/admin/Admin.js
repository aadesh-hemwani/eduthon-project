import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";

const validEmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
);
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
  return valid;
};

export default class Admin extends Component {
  state = {
    users: [],
    message: "",
    showHide: false,
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    errors: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  };

  handleChange = (e) => {
    e.preventDefault();
    let value = e.target.value;
    let name = e.target.name;
    let errors = this.state.errors;

    switch (name) {
      case "username":
        if (value.length === 0) {
          errors.username = "Please enter a username.";
        } else {
          errors.username = "";
        }
        break;

      case "email":
        if (value.length === 0) {
          errors.email = "Please enter your email.";
        } else if (!validEmailRegex.test(value)) {
          errors.email = "Please enter valid email.";
        } else {
          errors.email = "";
        }
        break;

      case "password":
        if (value.length === 0) {
          errors.password = "Please enter your password.";
        } else if (value.length < 8) {
          errors.password = "Password must be at least 8 characters long.";
        } else {
          errors.password = "";
        }
        break;

      case "confirm_password":
        if (this.state.password === "") {
          errors.confirm_password = "Please first enter the above password";
        } else if (value.length === 0) {
          errors.confirm_password = "Please re-enter your password.";
        } else if (value !== this.state.password) {
          errors.confirm_password = "Password does not match";
        } else {
          errors.confirm_password = "";
        }
        break;

      default:
        break;
    }

    this.setState({
      errors,
      [name]: value,
    });
  };

  handleModalShowHide() {
    this.setState({ showHide: !this.state.showHide });
  }
  handleLogout = (e) => {
    localStorage.clear();
    localStorage.setItem("isLoggedIn", false);
    window.location.replace("/login");
  };
  createAdmin = (e) => {
    e.preventDefault();
    if (validateForm(this.state.errors)) {
      let url = "/createAdmin?token=" + localStorage.getItem("token");
      let formData = new FormData();
      let data = this.state;
      for (let name in data) {
        formData.append(name, data[name]);
      }
      console.log(formData);
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          this.setState({ message: data.message });
        })
        .catch((error) => console.log(error));
    } else console.error("Invalid Form");
    this.setState({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    });
    this.handleModalShowHide();
  };
  getAllUsers = () => {
    let token = localStorage.getItem("token");
    let url = "/get_all_users?token=" + token;

    if (localStorage.getItem("token") !== null) {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            this.setState({
              message: data.message,
              isLoading: false,
            });
          }
          if (data.users) {
            this.setState({ users: data.users, isLoading: false });
          }
        })
        .catch((error) => console.log(error));
    }
  };

  componentDidMount() {
    this.getAllUsers();
  }

  render() {
    document.title = "Admin";
    const { errors } = this.state;
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <button className="navbar-brand">Admin Panel</button>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto ">
              <li className="nav-item active">
                <button
                  className="btn btn-outline-info"
                  onClick={() => this.handleModalShowHide()}
                >
                  Create Admin
                </button>
              </li>
              <li className="nav-item mx-4">
                <button
                  className="btn btn-outline-danger"
                  name="logout"
                  onClick={this.handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </nav>
        <div className="bg-info rounded p-4 text-light text-center">
          {this.state.message}
        </div>
        <div className="card mt-4">
          <div className="card-header">
            <i className="fas fa-table mr-1"></i>
            Users
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table
                className="table table-bordered"
                id="dataTable"
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th onClick={this.order_by_email}>Email</th>
                    <th>Username</th>
                    <th>Image</th>
                    <th>Registered</th>
                    <th>Last login</th>
                    <th>Threads Created</th>
                    <th>Threads Replied</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Image</th>
                    <th>Registered</th>
                    <th>Last login</th>
                    <th>Threads Created</th>
                    <th>Threads Created</th>
                    <th>Rating</th>
                  </tr>
                </tfoot>
                <tbody>
                  {this.state.users.map((user, index) => (
                    <tr key={index}>
                      <td>{user.id}</td>
                      <td>{user.email}</td>
                      <td>{user.username}</td>
                      <td>{user.image_file}</td>
                      <td>{user.created_date}</td>
                      <td>{user.last_login_time}</td>
                      <td>{user.threadsCreated}</td>
                      <td>{user.threadsReplied}</td>
                      <td>{user.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Modal show={this.state.showHide}>
          <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
            <Modal.Title>Create Admin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-row">
                <div className="col">
                  <div className="form-group">
                    <label className="small mb-1" htmlFor="inputFirstName">
                      Username
                    </label>
                    <input
                      className="form-control py-4"
                      id="inputFirstName"
                      type="text"
                      placeholder="Enter Username"
                      onChange={this.handleChange}
                      value={this.state.username}
                      name="username"
                      required
                      style={{ borderRadius: "20px" }}
                    />
                    {errors.username.length > 0 && (
                      <span className="error" style={{ color: "red" }}>
                        {errors.username}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="small mb-1" htmlFor="inputEmailAddress">
                  Email
                </label>
                <input
                  className="form-control py-4"
                  id="inputEmailAddress"
                  type="email"
                  aria-describedby="emailHelp"
                  placeholder="Enter email address"
                  autoComplete=""
                  onChange={this.handleChange}
                  value={this.state.email}
                  name="email"
                  required
                  style={{ borderRadius: "20px" }}
                />
                {errors.email.length > 0 && (
                  <span className="error" style={{ color: "red" }}>
                    {errors.email}
                  </span>
                )}
              </div>
              <div className="form-row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="small mb-1" htmlFor="inputPassword">
                      Password
                    </label>
                    <input
                      className="form-control py-4"
                      id="inputPassword"
                      type="password"
                      placeholder="Enter password"
                      autoComplete=""
                      onChange={this.handleChange}
                      value={this.state.password}
                      name="password"
                      required
                      style={{ borderRadius: "20px" }}
                    />
                    {errors.password.length > 0 && (
                      <span className="error" style={{ color: "red" }}>
                        {errors.password}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label
                      className="small mb-1"
                      htmlFor="inputConfirmPassword"
                    >
                      Confirm Password
                    </label>
                    <input
                      className="form-control py-4"
                      id="inputConfirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      autoComplete=""
                      onChange={this.handleChange}
                      value={this.state.confirm_password}
                      name="confirm_password"
                      required
                      style={{ borderRadius: "20px" }}
                    />
                    {errors.confirm_password.length > 0 && (
                      <span className="error" style={{ color: "red" }}>
                        {errors.confirm_password}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.handleModalShowHide()}
            >
              Close
            </Button>
            <Button variant="info" onClick={this.createAdmin}>
              Create
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
