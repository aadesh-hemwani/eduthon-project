import React, { Component } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default class Quiz extends Component {
  state = {
    quizzes: [],
    message: "",
  };

  getClassroomQuiz = () => {
    let token = localStorage.getItem("token");
    let classroom_id = "VCH1V8";
    let url = "/getClassroomQuiz?classroom_id=" + classroom_id;

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
          if (data.quizzes) {
            this.setState({ quizzes: data.quizzes, isLoading: false });
            console.log(this.state.quizzes);
          }
        })
        .catch((error) => console.log(error));
    }
  };
  componentDidMount() {
    this.getClassroomQuiz();
  }

  render() {
    return (
      <div className="container">
        <div className="mt-4">
          <h3>Classroom Quiz</h3>
          <div>{this.state.message}</div>
          {this.state.quizzes.map((quiz, index) => (
            <div key={index}>
              <Card className="mt-4 question_card">
                <Card.Body>
                  <Link
                    to={{
                      pathname: "/quizPage",
                      question: quiz.question,
                      options: quiz.options,
                    }}
                  >
                    <Card.Title>{quiz.question}</Card.Title>
                  </Link>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
