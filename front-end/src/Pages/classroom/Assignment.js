import React, { Fragment } from "react";

export default class Assignment extends React.Component {
  render() {
    return (
      <Fragment>
        <div className="p-2" style={{ height: "calc(100vh)" }}>
          <div
            className="float-right mt-2"
            data-toggle="modal"
            data-target="#centralModalSm1"
            style={{ cursor: "pointer" }}
          >
            <i className="fas fa-plus"></i> New assignment
          </div>
          <hr className="mt-5" />
          <input
            type="text"
            className="w-100 pl-3"
            name="discussion"
            style={{ height: "calc(10vh)" }}
            placeholder="Share something"
          />
          <div>
            <div
              className="card pt-2 pb-2 mt-3 mb-2"
              data-toggle="modal"
              data-target="#centralModalMd3"
              style={{ height: "calc(8vh)" }}
            >
              <div className="pl-2">
                <span className="font-weight-bold">
                  Divya agarwal posted a new assignment
                </span>
                <span className="float-right pr-3 mt-3">
                  <i class="fas fa-ellipsis-v"></i>
                </span>
                <div>Aug 29</div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="centralModalMd3"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myModalLabel"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-lg"
            role="document"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "calc(100vw)",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <h3 className="modal-title w-100" id="myModalLabel">
                    MCQ test on first two units
                  </h3>
                  <div>Divya agarwal - Aug 29</div>
                  <div>100 points</div>
                </div>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span className="mt-3" aria-hidden="true">
                    &times;
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div>
                  testmoz.com/5331672
                  <br />
                  <br />
                  Type the link in chrome click student tab and enter ur ves
                  college id only ...
                  <br />
                  the test results will be considered only one attempt is
                  possible..
                  <br />
                </div>
              </div>
              <div className="modal-footer">
                <span className="col-10 p-0">
                  <i class="fas fa-link"></i> Attach
                  <i class="fas fa-check ml-3"></i> Mark complete
                </span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={this.createClassroom}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="centralModalSm1"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myModalLabel"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-lg"
            role="document"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 350,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title w-100" id="myModalLabel">
                  New assignment
                </h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form id="addAssignmentForm">
                  <div className="form-row">
                    <div className="form col-12">
                      <label htmlFor="title">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Title"
                        id="title"
                      />
                    </div>
                  </div>
                  <div className="form-row mt-2">
                    <div className="form col-12">
                      <label htmlFor="title">Instructions</label>
                      <textarea
                        className="form-control"
                        name="Title"
                        id="title"
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <span className="col-8">
                  <i class="fas fa-link"></i> Attach
                </span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary btn-sm">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
