import React, { Component } from "react";
import "../../assets/css/threadPage.css";
import ThreadReplies from "./ThreadReplies";
import { Button, Modal } from "react-bootstrap";

export default class ThreadPage extends Component {
  state = {
    thread: {},
    isLoading: true,
    reply: "",
    showHide: false,
  };
  handleModalShowHide() {
    this.setState({ showHide: !this.state.showHide });
  }
  handleChange = (e) => {
    e.preventDefault();
    let value = e.target.value;
    let name = e.target.name;
    this.setState({
      [name]: value,
    });
  };

  getThreadDetails = () => {
    let token = localStorage.getItem("token");
    let url =
      "/get_thread_details?token=" +
      token +
      "&threadid=" +
      this.props.location.id;

    if (localStorage.getItem("token") !== null) {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            this.setState({
              message: data.message,
            });
          }
          if (data.thread) {
            this.setState({ thread: data.thread, isLoading: false });
          }
        })
        .catch((error) => console.log(error));

      this.setState({ reply: "" });
    }
  };

  deleteThread = () => {
    let token = localStorage.getItem("token");
    console.log(this.props.location.id);
    let url =
      "/delete_user_threads?token=" +
      token +
      "&threadid=" +
      this.props.location.id;

    if (localStorage.getItem("token") !== null) {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            this.setState({
              message: data.message,
            });
            alert(data.message);
            this.props.history.push("/");
          }
          if (data.thread) {
            this.setState({ thread: data.thread, isLoading: false });
          }
        })
        .catch((error) => console.log(error));

      this.setState({ reply: "" });
    }
  };
  componentDidMount() {
    if (this.props.location.id === undefined) {
      this.props.history.push("/");
    }
    this.getThreadDetails();
  }

  replyThread = (e) => {
    e.preventDefault();
    if (this.state.reply.length !== 0) {
      let token = localStorage.getItem("token");
      console.log(token);
      let url = "/reply_on_thread?token=" + token;
      let formData = new FormData();

      formData.append("threadid", this.props.location.id);
      formData.append("reply", this.state.reply);

      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          this.getThreadDetails();
        })
        .catch((error) => console.log(error));
    }
  };

  render() {
    let replies = "";
    if (this.state.thread.replies) {
      if (this.state.thread.replies.length === 0) {
        replies = "No replies yet";
      } else {
        replies = this.state.thread.replies.map((reply, index) => (
          <div key={index}>
            <ThreadReplies
              reply={reply.reply}
              author={reply.author}
              time={reply.replied.split(" ")[0]}
            />
          </div>
        ));
      }
    }

    let { asked, author, question } = this.state.thread;
    let deleteBtn = "";
    if (author === localStorage.getItem("email")) {
      deleteBtn = (
        <button
          className="btn btn-outline-danger ml-4 deleteBtn"
          onClick={() => this.handleModalShowHide()}
        >
          Delete Thread
        </button>
      );
    }

    if (asked) {
      asked = asked.split(" ")[0];
    }

    return (
      <div className="container1 card">
        <div className="top_bar card-header">
          <div className="author">
            <span className="muted">By: </span>
            {author}
          </div>
          <div className="time">
            <span className="muted">Asked:</span> {asked}
          </div>
        </div>

        <div className="main">
          <div className="question">{question}</div>
          <div className="dividor"></div>
          <div className="replyTag">Replies</div>
          <div className="dividor"></div>
          <div className="replies">{replies}</div>
          <div className="bottom_input">
            <div className="form-group">
              <textarea
                className="form-control"
                value={this.state.reply}
                onChange={this.handleChange}
                rows="3"
                placeholder="Type your reply here"
                name="reply"
              ></textarea>
            </div>
            <button
              className="btn btn-outline-primary"
              onClick={this.replyThread}
            >
              Post
            </button>
            {deleteBtn}
          </div>
        </div>
        <Modal show={this.state.showHide}>
          <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
            <Modal.Title>Confirm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Are you sure you want to delete this Thread</div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.handleModalShowHide()}
            >
              No
            </Button>
            <Button variant="danger" onClick={this.deleteThread}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
