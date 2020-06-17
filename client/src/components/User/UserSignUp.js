// gtg
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Form from "../Form";

class UserSignUp extends Component {
  state = {
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
    errors: [],
  };

  // ======================================================
  // onChange handler
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value,
      };
    });
  };

  // ======================================================
  // code for submit button
  submit = () => {
    const { context } = this.props;

    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
    } = this.state;

    const user = {
      firstName,
      lastName,
      emailAddress,
      password,
    };

    // if passwords match sign user in
    if (password === confirmPassword) {
      context.data
        .createUser(user)
        .then((errors) => {
          if (errors.length) {
            this.setState({ errors });
          } else {
            context.actions.signIn(emailAddress, password).then(() => {
              this.props.history.push("/");
            });
          }
        })
        .catch((err) => {
          this.props.history.push("/error");
        });
    } else {
      // error if passwords do not match
      // also - make sure error is an array!
      this.setState({
        errors: ["Error: Passwords do not match!"],
      });
    }
  };

  // ======================================================
  // for cancel button
  cancel = () => {
    this.props.history.push("/");
  };

  // ======================================================
  render() {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
      errors,
    } = this.state;

    // ====================================================
    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          <Form
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign Up"
            elements={() => (
              <div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={this.change}
                  placeholder="First Name"
                />
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={this.change}
                  placeholder="Last Name"
                />
                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="text"
                  value={emailAddress}
                  onChange={this.change}
                  placeholder="Email Address"
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={this.change}
                  placeholder="Password"
                />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={this.change}
                  placeholder="Confirm Password"
                />
              </div>
            )}
          />
          <p>&nbsp;</p>
          <p>
            Already have an account? <NavLink to="/signin">Click here</NavLink>{" "}
            to sign in!
          </p>
        </div>
      </div>
    );
  }
}

export default UserSignUp;
