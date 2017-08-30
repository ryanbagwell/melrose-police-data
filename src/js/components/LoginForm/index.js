import React from 'react';
import PropTypes from 'prop-types';
import getFirebase from '../../utils/getFirebase';


const fb = getFirebase();

export default class LoginForm extends React.Component {


  handleSubmit = (e) => {
    e.preventDefault();

    fb.auth()
      .signInWithEmailAndPassword(this.email.value, this.password.value)
      .then(() => {
        window.location = '/';
      })
      .catch((err) => {
        alert(`Error: ${err.message}`)
      });
  };

  render() {

    return (

      <div
          className="App__filter panel panel-default">

        <div className="panel-heading">
          <h2 className="panel-title">Login</h2>
        </div>

        <div className="panel-body">

          <form onSubmit={this.handleSubmit}>

            <div className="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                placeholder="Email"
                ref={x => this.email = x} />
            </div>

            <div className="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
                ref={x => this.password = x} />
            </div>

            <button type="submit" className="btn btn-default">Submit</button>

          </form>
        </div>

      </div>

    )

  }


}