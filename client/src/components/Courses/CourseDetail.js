// gtg
import React, { Component } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

class CourseDetail extends Component {
  state = {
    courseDetails: [],
  };

  // ======================================================
  componentDidMount() {
    const { context } = this.props;

    context.data
      .getCourse(this.props.match.params.id)
      .then((course) => {
        if (course) {
          this.setState({
            courseDetails: course,
          });
        } else {
          // no such course
          this.props.history.push("/notfound");
        }
      })
      .catch((err) => {
        // something went wrong - log out error - show error page
        console.error("Error: ", err);
        this.props.history.push("/error");
      });
  }

  // ======================================================
  deleteThisCourse = (event) => {
    const { context } = this.props;
    const { id } = this.props.match.params;
    const { emailAddress, password } = context.authenticatedUser;

    // run deleteCourse func
    context.data
      .deleteCourse(id, emailAddress, password)
      .then(() => {
        // return to root
        this.props.history.push("/");
      })
      // something went wrong - log out error - show error page
      .catch((err) => {
        console.error("Error: ", err);
        this.props.history.push("/error");
      });
  };

  // ======================================================
  render() {
    const { context } = this.props;
    const authenticatedUser = context.authenticatedUser;

    const {
      id,
      title,
      description,
      estimatedTime,
      materialsNeeded,
      userId,
    } = this.state.courseDetails;

    // accessing nested objects (pita!!)
    const firstName = ((this.state.courseDetails || {}).User || {}).firstName;
    const lastName = ((this.state.courseDetails || {}).User || {}).lastName;

    // markup for Action Bar (buttons)
    // Update, Delete and List buttons
    const updateCourseAndListButtons = (
      <div>
        <div className="bounds">
          <div className="grid-100">
            <span>
              <Link className="button" to={`/courses/${id}/update`}>
                Update Course
              </Link>
              <button onClick={this.deleteThisCourse} className="button">
                Delete Course
              </button>
              <Link className="button button-secondary" to="/">
                Return to List
              </Link>
            </span>
          </div>
        </div>
      </div>
    );

    const listButtonOnly = (
      <div>
        <div className="bounds">
          <div className="grid-100">
            <span>
              <Link className="button button-secondary" to="/">
                Return to List
              </Link>
            </span>
          </div>
        </div>
      </div>
    );

    // initialize the actionBar
    let actionBar;

    // decide which buttons to show on the action bar
    if (authenticatedUser) {
      if (userId === context.authenticatedUser.id) {
        //  user is authenticated and also the author
        actionBar = updateCourseAndListButtons;
      } else {
        // user is authenticated but not the author
        actionBar = listButtonOnly;
      }
    } else {
      // user is not authenticated
      actionBar = listButtonOnly;
    }

    return (
      <React.Fragment>
        {/* show correct action bar */}
        <div className="action--bar">{actionBar}</div>

        {/* Course Name and Author */}
        <div className="bounds course--detail">
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{title}</h3>
              <p>
                By {firstName} {lastName}{" "}
              </p>
            </div>

            {/* Description */}
            <div className="course--description">
              <div>
                <ReactMarkdown source={description} />
              </div>
            </div>
          </div>

          {/* Est Time */}
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                <li className="course--stats--list--item">
                  <h4>Estimated Time</h4>
                  <h3>{estimatedTime}</h3>
                </li>

                {/* Materials */}
                <li className="course--stats--list--item">
                  <h4>Materials Needed</h4>
                  <ul>
                    <ReactMarkdown source={materialsNeeded} />
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default CourseDetail;
