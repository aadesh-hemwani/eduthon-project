import React, { Component } from "react";

export default class FileUpload extends Component {
  state = {
    selectedFile: null,
  };

  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  handleUpload = (e) => {
    e.preventDefault();
    let url = "/upload";
    let formData = new FormData();
    formData.append("file", this.state.selectedFile);

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.log(error));
  };

  render() {
    document.title = "File Upload";
    return (
      <div className="container-fluid">
        <h2 className="text-dark mt-3">Upload File</h2>
        <form
          method="POST"
          action=""
          className="container bg-dark p-4 rounded mt-4"
        >
          <div className="form-group">
            <input
              autoComplete=""
              className="form-control btn btn-secondary"
              onChange={this.onFileChange}
              type="file"
              name="fileName"
            />
          </div>
          <div className="form-group">
            <input
              autoComplete=""
              onClick={this.handleUpload}
              className="btn btn-outline-light btn-block"
              type="button"
              value="Upload"
            />
          </div>
        </form>
      </div>
    );
  }
}
