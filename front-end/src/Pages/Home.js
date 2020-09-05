import React, { Component } from "react";
import "../assets/css/profile.css";
import profile from "../assets/images/profile.jpg";
import background from "../assets/images/background.jpg";
import ErrorPage from "./ErrorPage";
import { Card } from "react-bootstrap";

const ref = React.createRef();
const options = {
  orientation: "landscape",
};

export default class Home extends Component {
  state = {
    username: "",
    email: "",
    profile_pic: "",
    error: "",
    threadsCreated: 0,
    threadsReplied: 0,
    rating: 0,
    threads: [],
  };

  getUserThreads = () => {
    let token = localStorage.getItem("token");
    let url = "/get_all_user_threads?token=" + token;

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
          if (data.threads) {
            console.log(data.threads);
            this.setState({
              threads: data.threads.slice(0, 5),
              isLoading: false,
            });
          }
        })
        .catch((error) => console.log(error));
    }
  };

  printToPdf = () => {
    window.print();
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
            threadsCreated: data.threadsCreated,
            threadsReplied: data.threadsReplied,
            rating: data.rating,
          });
        })
        .catch((error) => console.log(error));

      this.getUserThreads();
    }
  }
  render() {
    let {
      username,
      email,
      threadsCreated,
      threadsReplied,
      rating,
    } = this.state;

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
        <div className="main" ref={ref}>
          <div className="imgs">
            <img src={background} className="background_img" alt="profile" />
            <img src={profile_pic} className="profile_img" alt="profile" />
          </div>
          <div className="details">
            <h1 className="name">{username}</h1>
            <div className="email">{email}</div>
          </div>

          <div className="container mt-4">
            <h3 className="title text-secondary">Dashboard</h3>

            <div>
              <div className="container">
                <div className="row mb-4">
                  <div className="card card_score col-md m-2">
                    <span className="count">{threadsCreated}</span>
                    <span>Questions asked</span>
                  </div>
                  <div className="card card_score col-md m-2">
                    <span className="count">{threadsReplied}</span>
                    <span>Questions Replied</span>
                  </div>
                  <div className="card card_score col-md m-2">
                    <span className="count">0</span>
                    <span>Assignments submitted</span>
                  </div>
                  <div className="card card_score col-md m-2">
                    <span className="count">0</span>
                    <span>Quiz Finished</span>
                  </div>
                  <div className="card card_score col-md m-2">
                    <span className="count">{rating}</span>
                    <span>Points</span>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md m-2">
                    <div className="card">
                      <div className="card-header">Recent Threads</div>
                      <div className="card-body">
                        {this.state.threads.map((thread, index) => (
                          <div key={index}>
                            <Card className="mt-4 question_card">
                              <Card.Body>
                                <Card.Title>{thread.question}</Card.Title>
                                <Card.Link className="asked_time">
                                  <b>Asked:</b>&nbsp;
                                  {thread.asked.split(" ")[0]}
                                </Card.Link>
                              </Card.Body>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-md m-2">
                    <div className="card">
                      <div className="card-header">Recent Threads</div>
                      <div className="card-body">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Voluptas recusandae magnam suscipit odio, est veritatis
                        dolores dignissimos soluta sapiente. Ab amet iusto qui
                        harum voluptatibus tempora. Dolor rem eius cupiditate.ng
                        elit. Voluptas recusandae magnam suscipit odio, est
                        veritatis dolores dignissimos soluta sapiente. Ab amet
                        iusto qui harum voluptatibus tempora. Dolor rem eius
                        cupiditate.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
