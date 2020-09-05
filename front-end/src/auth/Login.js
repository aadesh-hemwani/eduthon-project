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

export default class Login extends Component {
  state = {
    email: "",
    password: "",

    login_error: "",
    errors: {
      email: "",
      password: "",
    },
  };

  handleChange = (e) => {
    e.preventDefault();
    let value = e.target.value;
    let name = e.target.name;
    let errors = this.state.errors;

    switch (name) {
      case "email":
        errors.email =
          value.length === 0
            ? "Please enter your email."
            : (errors.email = validEmailRegex.test(value)
                ? ""
                : "Please enter valid email.");
        break;
      case "password":
        errors.password =
          value.length === 0
            ? "Please enter your password."
            : (errors.password =
                value.length < 8
                  ? "Password must be at least 8 characters long."
                  : "");
        break;
      default:
        break;
    }

    this.setState({
      errors,
      [name]: value,
    });
  };

  handleLogin = (e) => {
    e.preventDefault();

    if (validateForm(this.state.errors)) {
      let url = "/login";

      let formData = new FormData();
      let data = this.state;

      for (let name in data) {
        formData.append(name, data[name]);
      }

      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          this.setState({ login_error: data.error });
          if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("isAdmin", data.isAdmin);

            if (data.isAdmin) {
              this.props.history.push("/admin");
            } else {
              this.props.history.push("/");
            }
          } else {
            this.setState({ login_error: data.error });
          }
        })
        .catch((error) => console.log(error));
    } else console.error("Invalid Form");
  };

  render() {
    document.title = "Login";
    const { errors } = this.state;
    return (
      <div className="background">
        <div id="layoutAuthentication">
          <div id="layoutAuthentication_content">
            <main
              style={{ height: "calc(100vh - 100px)" }}
              className="justify-content-center d-flex align-center align-items-center"
            >
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-5">
                    <div
                      className="card shadow-lg border-0"
                      style={{ borderRadius: "20px" }}
                    >
                      <div className="card-header">
                        <h3 className="text-center font-weight-light my-4">
                          Login
                        </h3>
                      </div>
                      <div className="card-body">
                        <form onSubmit={this.handleLogin}>
                          <div
                            style={{
                              textAlign: "center",
                              background: "salmon",
                              color: "white",
                              borderRadius: "5px",
                            }}
                          >
                            <span> {this.state.login_error} </span>
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
                              placeholder="Enter email address"
                              autoComplete=""
                              onChange={this.handleChange}
                              value={this.state.email}
                              type="email"
                              name="email"
                              style={{ borderRadius: "20px" }}
                            />
                            {errors.email.length > 0 && (
                              <span className="error" style={{ color: "red" }}>
                                {errors.email}
                              </span>
                            )}
                          </div>
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
                              placeholder="Enter password"
                              autoComplete=""
                              onChange={this.handleChange}
                              value={this.state.password}
                              type="password"
                              name="password"
                              style={{ borderRadius: "20px" }}
                            />
                            {errors.password.length > 0 && (
                              <span className="error" style={{ color: "red" }}>
                                {errors.password}
                              </span>
                            )}
                          </div>

                          <div className="form-group d-flex align-items-center justify-content-between mt-4 mb-0">
                            <Link to="/forgotPassword" className="small">
                              Forgot Password?
                            </Link>
                            <button
                              className="btn btn-primary"
                              onClick={this.handleLogin}
                              type="submit"
                              style={{
                                borderRadius: "10px",
                                padding: "5px 10px",
                              }}
                            >
                              Login
                            </button>
                          </div>
                        </form>
                      </div>
                      <div className="card-footer text-center">
                        <div className="small">
                          <Link to="/register">Need an account? Sign up!</Link>
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
