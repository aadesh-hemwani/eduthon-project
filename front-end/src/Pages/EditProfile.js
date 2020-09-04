import React, { Component } from "react";
import profile from "../assets/images/profile.jpg";
import "../assets/css/editProfile.css";

export default class EditProfile extends Component {
  state = {
    username: "",
    email: "",
    profile_pic: "",
    selectedProfile: "",
  };

  componentDidMount() {
    let token = localStorage.getItem("token");
    let url = "/home?token=" + token;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          username: data.username,
          email: data.email,
          profile_pic: data.image,
        });
      })
      .catch((error) => console.log(error));
  }

  handleChange = (e) => {
    e.preventDefault();
    let value = e.target.value;
    let name = e.target.name;
    this.setState({
      [name]: value,
    });
  };

  onFileChange = (event) => {
    this.setState({ selectedProfile: event.target.files[0] });
  };

  handleProfileUpdate = (e) => {
    e.preventDefault();
    let token = localStorage.getItem("token");
    let url = "/updateprofile?token=" + token;

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
        if (data.error) {
          alert(data.error);
        } else {
          window.location.replace("/");
        }
      })
      .catch((error) => console.log(error));
  };
  render() {
    let pr = "";
    if (this.state.profile_pic === "default.jpg") {
      pr = profile;
    } else {
      pr = this.state.profile_pic;
    }
    return (
      <div className="container-fluid edit_profile_div">
        <div className="image_holder">
          <img src={pr} className="profile_pic" alt="profile" />
        </div>
        <form>
          <div className="form-row">
            <div className="col">
              <div className="">
                Update Profile&nbsp;&nbsp;
                <input
                  className="py-4"
                  type="file"
                  accept="image/*"
                  name="profile_pic"
                  onChange={this.onFileChange}
                />
              </div>
            </div>
          </div>

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
                />
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
              disabled
              value={this.state.email}
              name="email"
            />
          </div>
          <div className="form-group mt-4 mb-0">
            <button
              className="btn btn-primary "
              onClick={this.handleProfileUpdate}
              type="button"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }
}
