import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Quiz from "./Quiz";
import QuizPage from "./QuizPage";

export default class QuizRoutes extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path={"/"} exact component={Quiz} />
          <Route path={"/quizPage"} component={QuizPage} />
        </Switch>
      </Router>
    );
  }
}
