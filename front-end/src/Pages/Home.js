import React, { Component } from "react";
import "../assets/css/profile.css";
import profile from "../assets/images/profile.jpg";
import background from "../assets/images/background.jpg";
import ErrorPage from "./ErrorPage";
export default class Home extends Component {
  state = {
    username: "",
    email: "",
    profile_pic: "",
    error: "",
  };

  componentDidMount() {
    let token = localStorage.getItem("token");
    let url = "/home?token=" + token;
    if (localStorage.getItem("token") !== null) {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.message) {
            this.setState({
              error: data.message,
            });
          }
          localStorage.setItem("email", data.email);
          this.setState({
            username: data.username,
            email: data.email,
            profile_pic: data.image,
          });
        })
        .catch((error) => console.log(error));
    }
  }
  render() {
    if (this.state.error !== "") {
      return <ErrorPage errorMsg={this.state.error} />;
    }

    let profile_pic;
    if (this.state.profile_pic === "default.jpg") {
      profile_pic = profile;
    } else {
      profile_pic = this.state.profile_pic;
    }
    return (
      <div>
        <div className="main">
          <div className="imgs">
            <img src={background} className="background_img" alt="profile" />
            <img src={profile_pic} className="profile_img" alt="profile" />
          </div>
          <div className="details">
            <h1 className="name">{this.state.username}</h1>
            <div className="email">{this.state.email}</div>
          </div>
        </div>
      </div>
    );
  }
}
