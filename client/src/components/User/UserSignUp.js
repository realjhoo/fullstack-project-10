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

    // need to refactor - not elegant
    // if passwords match sign user in
    if (password === confirmPassword) {
      context.data
        .createUser(user)
        .then((errors) => {
          // if there are API errors, fix up for display
          if (errors) {
            errors = JSON.stringify(errors).split(","); // convert obj to array
            errors.pop(); // remove braces from end
            // extract useful bit of first error message
            if (errors.length) {
              errors[0] = errors[0].slice(29);
              if (errors[0] === 'already in use."') {
                // restore "Email address already in use." error
                errors[0] = "Email address already in use.";
              }
            }
            // if there's more than one error, fix those, too
            if (errors.length > 1) {
              for (let j = 1; j < errors.length; j++) {
                errors[j] = errors[j].slice(19);
              }
            }
            if (errors.length) {
              // remove trailing quote on the last error message
              errors[errors.length - 1] = errors[errors.length - 1].slice(
                0,
                -1
              );
            }
          }

          // set the fix up error
          if (errors.length) {
            this.setState({ errors });
          } else {
            context.actions.signIn(emailAddress, password).then(() => {
              this.props.history.push("/");
            });
          }
        })
        .catch((err) => {
          console.log("Err: ", err);
          this.props.history.push("/error");
        });
    } else {
      // password blanl - set error
      if (password.length === 0) {
        this.setState({
          errors: ["Please enter a password."],
        });
      } else {
        // passwords dont match - set an error
        this.setState({
          errors: ["Passwords do not match!"],
        });
      }
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
