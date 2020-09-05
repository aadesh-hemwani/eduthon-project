import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import "../../assets/css/threads.css";
import ThreadQuestion from "./ThreadQuestion";

export default class Threads extends Component {
  state = {
    message: "",
    threads: [],
    showHide: false,
    question: "",
    isLoading: true,
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
            this.setState({ threads: data.threads, isLoading: false });
          }
        })
        .catch((error) => console.log(error));
    }
  };
  componentDidMount() {
    this.getUserThreads();
  }
  handleModalShowHide() {
    this.setState({ showHide: !this.state.showHide });
  }

  createThread = (e) => {
    e.preventDefault();
    let token = localStorage.getItem("token");
    console.log(token);
    let url = "/createThread?token=" + token;
    let formData = new FormData();

    formData.append("question", this.state.question);

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.handleModalShowHide();
        this.getUserThreads();
      })
      .catch((error) => console.log(error));
  };

  handleChange = (e) => {
    e.preventDefault();
    let value = e.target.value;
    let name = e.target.name;
    this.setState({
      [name]: value,
    });
  };

  render() {
    if (this.state.isLoading) {
      return <div className="loading">Loading ...</div>;
    } else {
      return (
        <div className="container-fluid mt-4">
          <button
            className="btn btn-outline-primary ask_question_btn"
            type="button"
            onClick={() => this.handleModalShowHide()}
          >
            Ask a Question
          </button>

          <div className="mt-4">
            <h3>Current user Threads</h3>
            <div>{this.state.message}</div>
            {this.state.threads.map((thread, index) => (
              <div key={index}>
                <ThreadQuestion
                  question={thread.question}
                  by={thread.author}
                  time={thread.asked}
                  id={thread.id}
                />
              </div>
            ))}
          </div>
          <Modal show={this.state.showHide}>
            <Modal.Header
              closeButton
              onClick={() => this.handleModalShowHide()}
            >
              <Modal.Title>Ask a Question</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-group">
                <label className="small mb-1" htmlFor="inputEmailAddress">
                  Question
                </label>
                <input
                  className="form-control py-4"
                  placeholder="Post a question"
                  autoComplete=""
                  onChange={this.handleChange}
                  value={this.state.question}
                  type="text"
                  name="question"
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => this.handleModalShowHide()}
              >
                Close
              </Button>
              <Button variant="primary" onClick={this.createThread}>
                Post
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
  }
}
