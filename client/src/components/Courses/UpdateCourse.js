// gtg
import React, { Component } from "react";
import Form from "../Form";

class UpdateCourse extends Component {
  state = {
    id: null,
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
    userId: null,
    errors: [],
  };

  // ======================================================
  componentDidMount() {
    const { context } = this.props;

    // run getCourse func
    context.data
      .getCourse(this.props.match.params.id)
      .then((course) => {
        if (course) {
          if (course.userId === context.authenticatedUser.id) {
            this.setState({
              id: course.id,
              title: course.title,
              description: course.description,
              estimatedTime: course.estimatedTime,
              materialsNeeded: course.materialsNeeded,
              userId: course.userId,
            });
          } else {
            // user doesnt have permission to be here
            this.props.history.push("/forbidden");
          }
        } else {
          // no such course
          this.props.history.push("/notfound");
        }
      })
      .catch((err) => {
        // something else went wrong - log out error - show error page
        console.error("Error: ", err);
        this.props.history.push("/error");
      });
  }

  // ======================================================
  // update on change
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
  // user pressed update
  submit = () => {
    // vars
    const { context } = this.props;
    const emailAddress = context.authenticatedUser.emailAddress;
    const password = context.authenticatedUser.password;

    const {
      id,
      title,
      description,
      estimatedTime,
      materialsNeeded,
      userId,
    } = this.state;

    const updatedCourseData = {
      id,
      title,
      description,
      estimatedTime,
      materialsNeeded,
      userId,
    };

    context.data
      // call updateCourse function
      .updateCourse(updatedCourseData, emailAddress, password)
      // if something goes wrong
      .then((errors) => {
        // The error from this module wants to be an object but
        // the form module is expecting an array
        // ugly hack follows
        // convert error object to string
        errors = JSON.stringify(errors);
        // split string into an array at the commas
        errors = errors.split(",");
        // remove last item from array (braces etc)
        errors.pop();
        if (errors.length) {
          // fix up error one (Extract useful part of message)
          errors[0] = errors[0].slice(0, -1);
          errors[0] = errors[0].slice(29);
          if (errors.length > 1) {
            // fix up error two
            errors[1] = errors[1].slice(0, -1);
            errors[1] = errors[1].slice(19);
          }
        } // end hack

        if (errors.length) {
          this.setState({ errors });
        } else {
          // otherwise return to detail page
          this.props.history.push(`/courses/${updatedCourseData.id}`);
        }
      })
      // something went wrong - log error - show error page
      .catch((err) => {
        console.error("Error: ", err);
        this.props.history.push("/error");
      });
  };

  // ======================================================
  // user pressed cancel
  cancel = () => {
    // return to details
    this.props.history.push(`/courses/${this.state.id}`);
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
          <h1>Update Course</h1>
          <Form
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Update Course"
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
                  </div>
                  <p>
                    By {firstName} {lastName}
                  </p>
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

export default UpdateCourse;
