// gtg
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "../styles/global.css";

// Components
import Header from "./Header";
import PrivateRoute from "./PrivateRoute";
import withContext from "./Context";
// Components (Courses)
import Courses from "./Courses/Courses";
import CourseDetail from "./Courses/CourseDetail";
import CreateCourse from "./Courses/CreateCourse";
import UpdateCourse from "./Courses/UpdateCourse";
// Components (User)
import UserSignUp from "./User/UserSignUp";
import UserSignIn from "./User/UserSignIn";
import UserSignOut from "./User/UserSignOut";
// Components (Error)
import NotFound from "./Errors/NotFound";
import UnhandledError from "./Errors/UnhandledError";
import Forbidden from "./Errors/Forbidden";

// withContext
// Header
const HeaderWithContext = withContext(Header);
// Courses
const CoursesWithContext = withContext(Courses);
const CourseDetailWithContext = withContext(CourseDetail);
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);
// User
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <HeaderWithContext />
        <Switch>
          <Route exact path="/" component={CoursesWithContext} />
          <Route path="/signup" component={UserSignUpWithContext} />
          <Route path="/signin" component={UserSignInWithContext} />
          <PrivateRoute
            path="/courses/create"
            component={CreateCourseWithContext}
          />
          <PrivateRoute
            path="/courses/:id/update"
            component={UpdateCourseWithContext}
          />
          <Route path="/courses/:id" component={CourseDetailWithContext} />
          <Route path="/signout" component={UserSignOutWithContext} />
          <Route path="/error" component={UnhandledError} />
          <Route path="/forbidden" component={Forbidden} />

          <Route path="/notfound" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
