import React, { useState, useEffect } from "react";

export default function Home() {
  const [contact, setContact] = useState("Contact Not Available");
  useEffect(() => {
    let token = localStorage.getItem("token");
    let url = "/contact?token=" + token;
    fetch(url).then((res) =>
      res.json().then((data) => {
        setContact(data.contact);
        document.title = data.title;
      })
    );
  }, []);

  return (
    <div className="container-fluid">
      <h1>Contact me: {contact}</h1>
    </div>
  );
}
