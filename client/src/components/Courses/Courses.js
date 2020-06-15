// gtg
import React, { Component } from "react";
import { Link } from "react-router-dom";

class Courses extends Component {
  state = {
    courses: [],
  };

  // ======================================================
  componentDidMount() {
    const { context } = this.props;

    context.data
      .getCourses()
      .then((courses) => {
        this.setState({
          courses,
        });
      })
      .catch((err) => {
        // something went wrong - log out error - show error page
        console.error("Error: ", err);
        this.props.history.push("/error");
      });
  }

  // ======================================================
  render() {
    const allCourses = this.state.courses.map((course) => {
      //
      // link to individual courses
      return (
        <div key={course.id} className="grid-33">
          <Link
            className="course--module course--link"
            to={`/courses/${course.id}`}
          >
            <h4 className="course--label">Course</h4>
            <h3 className="course--title">{course.title}</h3>
          </Link>
        </div>
      );
    });

    return (
      <div className="bounds">
        {allCourses}
        <div className="grid-33">
          <Link
            className="course--module course--add--module"
            to="/courses/create"
          >
            <h3 className="course--add--title">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 13 13"
                className="add"
              >
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 " />
              </svg>
              New Course
            </h3>
          </Link>
        </div>
      </div>
    );
  }
}

export default Courses;
