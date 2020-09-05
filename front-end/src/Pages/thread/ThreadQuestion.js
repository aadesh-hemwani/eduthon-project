import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
export default function ThreadQuestion(props) {
  return (
    <div>
      <Card className="mt-4 question_card">
        <Card.Body>
          <Link
            to={{
              pathname: "/threadpage",
              id: props.id,
            }}
          >
            <Card.Title>{props.question}</Card.Title>
          </Link>
          <Card.Link className="asked_by">
            <b>Asked by:</b>&nbsp;{props.by}
          </Card.Link>
          <Card.Link className="asked_time">
            <b>Asked:</b>&nbsp;
            {props.time.split(" ")[0]}
          </Card.Link>
        </Card.Body>
      </Card>
    </div>
  );
}
