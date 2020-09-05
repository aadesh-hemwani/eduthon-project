import React from "react";

export default function ThreadReplies(props) {
  return (
    <div className="reply card mb-4">
      <div className="top_bar2 card-header">
        <div className="author">
          <span className="muted">By: </span>
          {props.author}
        </div>
        <div className="time">
          <span className="muted">Answered: </span>
          {props.time}
        </div>
      </div>
      <div className="ans card-body">{props.reply}</div>
    </div>
  );
}
