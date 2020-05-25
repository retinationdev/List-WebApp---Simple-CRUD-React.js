// import React from 'react';
import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import axios from 'axios';




class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      first_name: "",
      last_name: "",
      buttonDisable: false,
      formStatus: "create",
      memberIdSelected: null,
    }
  }

  componentDidMount() {
    axios
      .get("https://reqres.in/api/users?page=1")
      .then(response => {
        this.setState({ members: response.data.data })
      })
      .catch(error => {
        error = "proses gagal"
        alert(error)
      })
  }

  onSubmitHandler = event => {
    event.preventDefault();
    this.setState({ buttonDisable: true });
    var payload = {
      first_name: this.state.first_name,
      last_name: this.state.last_name
    };
    var url = "";

    if (this.state.formStatus === "create") {
      url = "https://reqres.in/api/users";
      this.addMember(url, payload)
    } else {
      url = `https://reqres.in/api/users/${this.state.memberIdSelected}`
      this.editMember(url, payload)
    }
  };

  addMember = (url, payload) => {
    axios
      .post(url, payload)
      .then(response => {
        var members = [...this.state.members]
        members.push(response.data)
        this.setState({ members, buttonDisable: false, first_name: "", last_name: "" })
      })
      .catch(error => {
        alert(error)
      })
  }

  editMember = (url, payload) => {
    axios
      .put(url, payload)
      .then(response => {
        var members = [...this.state.members]
        var indexMember = members.findIndex(member => member.id === this.state.memberIdSelected)

        members[indexMember].first_name = response.data.first_name
        members[indexMember].last_name = response.data.last_name

        this.setState({
          members,
          buttonDisable: false,
          first_name: "",
          last_name: "",
          formStatus: "Create"
        })
      })
      .catch(error => {
        alert(error)
      })
  }

  inputOnchangehandler = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  editButtonHandler = member => {
    this.setState({
      first_name: member.first_name,
      last_name: member.last_name,
      formStatus: 'edit',
      memberIdSelected: member.id,
    })
  }

  deleteButtonHandler = id => {
    var url = `https://reqres.in/api/users/${id}`;
    axios
      .delete(url)
      .then(response => {
        if (response.status === 204) {
          var members = [...this.state.members]
          var index = members.findIndex(member => member.id === id)
          members.splice(index, 1)
          this.setState({ members })
          alert("Data Berhasil dihapus")
        }
      })
      .catch(error => {
        alert(error)
      })
  }

  render() {
    return (
      <div className="container">
        <h1>DevSchool</h1>
        <div className="row">

          <div className="col-md-6" style={{ border: "1px solid black" }}>
            <h2>Member</h2>
            <div className="row">
              {this.state.members.map((member, index) => (
                <div className="col-md-6" key={member.id}>
                  <div className="card" style={{ margin: 10 }}>
                    <div className="card-body">
                      <h5 className="card-title">{member.id}</h5>
                      <h5 className="card-title">{member.first_name}</h5>
                      <h5 className="card-title">{member.last_name}</h5>
                      <button type="button" className="btn btn-primary" onClick={() => this.editButtonHandler(member)} >Edit</button>
                      <button type="button" className="btn btn-danger" onClick={() => this.deleteButtonHandler(member.id)}>Delete</button>
                    </div>
                  </div>
                </div>

              ))}
            </div>
          </div>

          <div className="col-md-6" style={{ border: "1px solid black" }}>
            <h2>Form {this.state.formStatus} </h2>
            <form onSubmit={this.onSubmitHandler}>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  placeholder="Nama Depan"
                  value={this.state.first_name}
                  onChange={this.inputOnchangehandler} />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  placeholder="Nama Belakang"
                  value={this.state.last_name}
                  onChange={this.inputOnchangehandler} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={this.state.buttonDisable} >Submit</button>
            </form>
          </div>

        </div>

      </div >


    )
  }
}

export default App;
