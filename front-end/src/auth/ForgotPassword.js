import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class ForgotPassword extends Component {
  state = {
    message: "",
  };

  handleChange = (e) => {
    e.preventDefault();
    let value = e.target.value;
    let name = e.target.name;

    this.setState({
      [name]: value,
    });
  };

  handleResetPassword = (e) => {
    e.preventDefault();
    console.log(this.state.email);
    if (this.state.email !== undefined) {
      let url = "/send-forgot-password-mail?email=" + this.state.email;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          console.log(data.message);
          this.setState({ message: data.message });
        })
        .catch((error) => console.log(error));
    }
  };

  render() {
    return (
      <div>
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
                        className="card shadow-lg border-0 mt-5"
                        style={{ borderRadius: "20px" }}
                      >
                        <div className="card-header">
                          <h3 className="text-center font-weight-light my-4">
                            Password Recovery
                          </h3>
                        </div>
                        <div className="card-body">
                          <div className="small mb-3 text-muted">
                            Enter your Registered email address and we will send
                            you a link to reset your password.
                          </div>
                          <div className="bg-success text-light rounded text-center">
                            {this.state.message}
                          </div>
                          <form>
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
                                autoComplete=""
                                onChange={this.handleChange}
                                value={this.state.email}
                                type="email"
                                name="email"
                                aria-describedby="emailHelp"
                                placeholder="Enter email address"
                                style={{ borderRadius: "20px" }}
                              />
                            </div>
                            <div className="form-group d-flex align-items-center justify-content-between mt-4 mb-0">
                              <Link to="/login" className="small">
                                Return to login
                              </Link>
                              <button
                                className="btn btn-primary"
                                style={{ borderRadius: "20px" }}
                                onClick={this.handleResetPassword}
                              >
                                Reset Password
                              </button>
                            </div>
                          </form>
                        </div>
                        <div className="card-footer text-center">
                          <div className="small">
                            <Link to="/register">
                              Need an account? Sign up!
                            </Link>
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
                      <button href="#">Privacy Policy</button>
                      &middot;
                      <button href="#">Terms &amp; Conditions</button>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
