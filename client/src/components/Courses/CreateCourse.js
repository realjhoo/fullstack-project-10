// gtg
import React, { Component } from "react";
import Form from "../Form";

class CreateCourse extends Component {
  state = {
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
    userId: null,
    errors: [],
  };

  // ======================================================
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
  submit = () => {
    const { context } = this.props;
    const authenticatedUser = context.authenticatedUser;
    const { emailAddress, password, id } = authenticatedUser;

    const { title, description, estimatedTime, materialsNeeded } = this.state;

    // new couse data
    const newCourseData = {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      userId: id,
    };

    // call createCourse func
    context.data
      .createCourse(newCourseData, emailAddress, password)
      .then((errors) => {
        // if something went wrong
        if (errors) {
          this.setState({ errors });
        } else {
          // otherwise return to root
          this.props.history.push("/");
        }
      })
      .catch((err) => {
        // something went wrong - log error - show error page
        console.error("Error: ", err);
        this.props.history.push("/error");
      });
  };

  // ======================================================
  cancel = () => {
    // return to root
    this.props.history.push("/");
  };

  // ======================================================
  render() {
    const { context } = this.props;

    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      errors,
    } = this.state;

    const { firstName, lastName } = context.authenticatedUser;

    return (
      <div>
        <div className="bounds course--detail">
          <h1>Create Course</h1>
          <Form
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Create Course"
            elements={() => (
              <React.Fragment>
                <div className="grid-66">
                  <div className="course--header">
                    <h4 className="course--label">Course</h4>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={title}
                      placeholder="Course title..."
                      onChange={this.change}
                    />
                    <p>
                      By {firstName} {lastName}
                    </p>
                  </div>
                  <div className="course--description">
                    <textarea
                      id="description"
                      name="description"
                      value={description}
                      placeholder="Course description..."
                      onChange={this.change}
                    />
                  </div>
                </div>
                <div className="grid-25 grid-right">
                  <div className="course--stats">
                    <ul className="course--stats--list">
                      <li className="course--stats--list--item">
                        <h4>Estimated Time</h4>
                        <React.Fragment>
                          <input
                            type="text"
                            id="estimatedTime"
                            className="course--time--input"
                            name="estimatedTime"
                            value={estimatedTime}
                            placeholder="Hours"
                            onChange={this.change}
                          />
                        </React.Fragment>
                      </li>
                      <li className="course--stats--list--item">
                        <h4>Materials Needed</h4>
                        <React.Fragment>
                          <textarea
                            id="materialsNeeded"
                            className="materials"
                            name="materialsNeeded"
                            value={materialsNeeded}
                            placeholder="List materials..."
                            onChange={this.change}
                          />
                        </React.Fragment>
                      </li>
                    </ul>
                  </div>
                </div>
              </React.Fragment>
            )}
          />
        </div>
      </div>
    );
  }
}

export default CreateCourse;
