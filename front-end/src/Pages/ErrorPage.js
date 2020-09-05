import React from "react";

export default function ErrorPage(props) {
  return (
    <div style={{ fontWeight: "700", textAlign: "center" }}>
      {props.errorMsg}
    </div>
  );
}
