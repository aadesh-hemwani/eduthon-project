import React, { Component } from "react";
import "../../assets/css/quiz.css";

export default class QuizPage extends Component {
  render() {
    return (
      <div>
        <div id="quiz">
          <div className="question">
            <h3>
              <span className="label label-warning" id="qid">
                1
              </span>
              <span id="question">{this.props.location.question}</span>
            </h3>
          </div>
          <ul>
            <li>
              <input type="radio" id="f-option" name="selector" value="1" />
              <label htmlFor="f-option" className="element-animation">
                {this.props.location.options[0]}
              </label>
              <div className="check"></div>
            </li>

            <li>
              <input type="radio" id="s-option" name="selector" value="2" />
              <label htmlFor="s-option" className="element-animation">
                {this.props.location.options[1]}
              </label>
              <div className="check">
                <div className="inside"></div>
              </div>
            </li>

            <li>
              <input type="radio" id="t-option" name="selector" value="3" />
              <label htmlFor="t-option" className="element-animation">
                {this.props.location.options[2]}
              </label>
              <div className="check">
                <div className="inside"></div>
              </div>
            </li>
            <li>
              <input type="radio" id="z-option" name="selector" value="4" />
              <label htmlFor="t-option" className="element-animation">
                {this.props.location.options[3]}
              </label>
              <div className="check">
                <div className="inside"></div>
              </div>
            </li>
          </ul>
        </div>
        <div className="text-muted">
          <span id="answer"></span>
        </div>
      </div>
    );
  }
}
