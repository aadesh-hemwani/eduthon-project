import React, { Component } from "react";
import { Link } from "react-router-dom";

const validEmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
);
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
  return valid;
};

export default class Register extends Component {
  state = {
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

  handleRegister = (e) => {
    e.preventDefault();
    if (validateForm(this.state.errors)) {
      let url = "/register";
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
          if (data.token !== null) {
            window.location.replace("/");
          }
        })
        .catch((error) => console.log(error));
    } else console.error("Invalid Form");
  };

  render() {
    document.title = "Register";
    const { errors } = this.state;
    return (
      <div className="background">
        <div id="layoutAuthentication">
          <div id="layoutAuthentication_content">
            <main
              style={{ height: "calc(100vh - 120px)" }}
              className="justify-content-center d-flex align-center align-items-center"
            >
              <div className="container" style={{ borderRadius: "20px" }}>
                <div className="row justify-content-center">
                  <div className="col-lg-7">
                    <div
                      className="card shadow-lg border-0 mt-5"
                      style={{ borderRadius: "20px" }}
                    >
                      <div className="card-header">
                        <h3 className="text-center font-weight-light my-4">
                          Create Account
                        </h3>
                      </div>
                      <div className="card-body">
                        <form>
                          <div className="form-row">
                            <div className="col">
                              <div className="form-group">
                                <label
                                  className="small mb-1"
                                  htmlFor="inputFirstName"
                                >
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
                                  <span
                                    className="error"
                                    style={{ color: "red" }}
                                  >
                                    {errors.username}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <label
                              className="small mb-1"
                              htmlFor="inputEmailAddress"
                            >
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
                                <label
                                  className="small mb-1"
                                  htmlFor="inputPassword"
                                >
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
                                  <span
                                    className="error"
                                    style={{ color: "red" }}
                                  >
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
                                  <span
                                    className="error"
                                    style={{ color: "red" }}
                                  >
                                    {errors.confirm_password}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="form-group mt-4 mb-0">
                            <button
                              style={{ borderRadius: "20px" }}
                              className="btn btn-primary btn-block"
                              onClick={this.handleRegister}
                              type="submit"
                            >
                              Create Account
                            </button>
                          </div>
                        </form>
                      </div>
                      <div className="card-footer text-center">
                        <div className="small">
                          <Link to="/login">Have an account? Go to login</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
          <div id="layoutAuthentication_footer">
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
