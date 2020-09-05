import React, { Component } from "react";
// import background from "../assets/images/background.jpg";
// import { Button, Modal } from "react-bootstrap";
import $ from "jquery";

export default class Classroom extends Component {
    state = {
        message: "",
        classrooms: [],
        showHide: false,
        question: "",
        isLoading: false,
        classroom_link: "",
        classroom_name: ""
    };

    getClassroomDetails = () => {
        let token = localStorage.getItem("token");
        let url = "/getAllClassrooms?token=" + token;

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
                    console.log(data.classroom_details[0].classroom_name);
                    this.setState({
                        classrooms: data.classroom_details,
                    });
                    this.handleModalShowHide();
                    this.getUserThreads();
                })
                .catch((error) => console.log(error));
        }
    };

    createClassroom = (e) => {
        e.preventDefault();
        let token = localStorage.getItem("token");
        console.log(token);
        let url = "/createClassroom?token=" + token;
        let formData = new FormData();

        formData.append('classroom_link', this.state.classroom_link);
        formData.append('classroom_name', this.state.classroom_name);

        fetch(url, {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                // this.handleModalShowHide();
                // this.getUserThreads();
            })
            .catch((error) => console.log(error));
        // var modal = document.getElementById('centralModalMd');
        // ('#modal').modal('toggle');
        $("#centralModalMd .close").click();
        // if (e.target == modal) {
        //     modal.style.display = "none";
        // }
        this.getClassroomDetails();
    };

    handleChange = (e) => {
        e.preventDefault();
        let value = e.target.value;
        let name = e.target.name;
        this.setState({
            [name]: value,
        });
    };

    componentDidMount() {
        let formId = 'addClassroomForm';
        $('#' + formId + ' input').each(function () {
            if ($(this).val().length > 0) {
                $(this).next('label').addClass('active');
                $(this).next('button').next('label').addClass('active');
            }
        });

        $('#' + formId + ' textarea').each(function () {
            if ($(this).val().length > 0) {
                $(this).next('label').addClass('active');
            }
        });
        this.getClassroomDetails();
    }

    render() {
        if (this.state.isLoading) {
            return <div className="loading">Loading ...</div>;
        } else {
            return <div style={{ overflowX: "hidden" }}>
                <div className="row col-12">
                    <hr className="mt-5" />
                    <span className="float-left col-6 mt-3" style={{ fontSize: 25 }}>
                        Classroom
                    </span>
                    <span className="col-6">
                        <span className="float-right mt-3" style={{ fontSize: 15 }}>
                            <span data-toggle="modal" data-target="#centralModalMd" style={{ cursor: "pointer" }} ><i className="fas fa-plus mr-1"></i>Add</span>
                            <span data-toggle="modal" data-target="#centralModalSm" style={{ cursor: "pointer" }}><i className="fas fa-sign-in-alt mr-1 ml-3"></i>Join</span>
                        </span>
                    </span>
                </div>
                <hr />
                <div>
                    <div className="row p-4">
                        {this.state.classrooms.map((value, index) => {
                            return <div className="list-unstyled col-md-3 mb-4" key={index}>{
                                <div className="card shadow-sm" style={{ height: 250 }}>
                                    <div style={{ height: 125, width: "100%" }} className="mt-3">
                                        <div className="text-center" style={{ width: '100%' }}>
                                            <h5><span>{value.classroom_name}</span></h5>
                                        </div>
                                        <div className="text-center" style={{ width: '100%' }}>{value.classroom_id}</div><br />
                                        <div className="imgs text-center m-0" style={{
                                            border: '2px solid white',
                                            borderRadius: '50%',
                                            background: "gray",
                                            color: "white",
                                            width: 100,
                                            height: 100,
                                            textAlign: "center",
                                            lineHheight: 100,
                                            position: "absolute",
                                            left: "50%",
                                            top: "50%",
                                            transform: "translate(-50%, -50%)"
                                        }}>
                                        </div><br /><br /><br /><br /><br />
                                        <hr className="ml-3 mr-3" style={{ backgroundColor: "lightgray" }} />
                                    </div>
                                </div>

                            }</div>
                        })}
                    </div>
                    {/* {
                        // for(var i=0;i<10;i++)
                        <div className="row p-4">
                            <div className="col-sm card shadow-sm" style={{ height: 250 }}>
                                <div style={{ height: 125 }} className="mt-3">
                                    <div className="text-center" style={{ width: '100%' }}><h5>DBMS</h5></div>
                                    <div className="text-center" style={{ width: '100%' }}>Ramesh Solanki</div><br />
                                    <div className="imgs text-center m-0" style={{
                                        border: '2px solid white',
                                        borderRadius: '50%',
                                        background: "gray",
                                        color: "white",
                                        width: 100,
                                        height: 100,
                                        textAlign: "center",
                                        lineHheight: 100,
                                        position: "absolute",
                                        left: 100
                                    }}>
                                    </div><br /><br /><br /><br /><br />
                                    <hr style={{ backgroundColor: "lightgray" }} />
                                </div>
                            </div>
                        </div>
                    } */}
                </div>

                <div className="modal fade" id="centralModalMd" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                    aria-hidden="true" >

                    <div className="modal-dialog modal-lg" role="document" style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 500,
                        transform: "translate(-50%, -50%)"
                    }}>


                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title w-100" id="myModalLabel">Create classroom</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form id="addClassroomForm">
                                    <div className="form-row">
                                        <div className="form col-12">
                                            <label htmlFor="className">Subject</label>
                                            <input type="text" className="form-control" name="classroom_name" id="className" onChange={this.handleChange} />
                                        </div>
                                    </div><br />
                                    <div className="form-row">
                                        <div className="form col-12">
                                            <label htmlFor="subject">Class name</label>
                                            <input type="text" className="form-control" name="classroom_link" id="subject" onChange={this.handleChange} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary btn-sm" onClick={this.createClassroom}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="modal fade" id="centralModalSm" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                    aria-hidden="true" >

                    <div className="modal-dialog modal-lg" role="document" style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 350,
                        transform: "translate(-50%, -50%)"
                    }}>


                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title w-100" id="myModalLabel">Join classroom</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form id="addClassroomForm">
                                    <div className="form-row">
                                        <div className="form col-12">
                                            Ask your teacher for the class code, then enter it here.<br /><br />
                                            <label htmlFor="classCode">Class code</label>
                                            <input type="text" className="form-control" name="ClassCode" id="classCode" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary btn-sm">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    }
}