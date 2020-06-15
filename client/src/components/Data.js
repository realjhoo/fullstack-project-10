// gtg
import config from "../config";

export default class Data {
  // ========================================================
  api(
    path,
    method = "GET",
    body = null,
    requiresAuth = false,
    credentials = null
  ) {
    // path to the api endpoint
    const url = config.apiBaseUrl + path;

    // set headers
    const options = {
      method,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    };

    // if there's a body, set to string and pass
    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (requiresAuth) {
      const encodedCredentials = btoa(
        `${credentials.emailAddress}:${credentials.password}`
      );
      options.headers["Authorization"] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }

  // * * * USERS * * *
  // ======================================================
  async getUser(emailAddress, password) {
    const res = await this.api(`/users`, "GET", null, true, {
      emailAddress,
      password,
    });

    // if okay return the data we got from db
    if (res.status === 200) {
      return res.json().then((data) => data);
      // if not okay return errors
    } else if (res.status === 400 || res.status === 401) {
      return res.data.errors;
    } else {
      throw new Error();
    }
  }

  // ======================================================
  // create a user  - return error sif there's a problem
  async createUser(user) {
    const res = await this.api("/users", "POST", user);

    if (res.status === 201) {
      return [];
    } else if (res.status === 400) {
      return res.json().then((data) => {
        return data.errors;
      });
    } else {
      throw new Error();
    }
  }

  // * * * COURSES * * *
  // ======================================================
  // get all courses - if there's a problem return the errors
  async getCourses() {
    const res = await this.api("/courses", "GET");

    if (res.status === 200) {
      return res.json().then((data) => data);
    } else if (res.status === 401) {
      return null;
    } else {
      throw new Error();
    }
  }

  // ======================================================
  // retrieve the specific course - if there's a problem, return errors
  async getCourse(courseId) {
    const res = await this.api(`/courses/${courseId}`, "GET");

    if (res.status === 200) {
      return res.json().then((data) => data);
    } else if (res.status === 401) {
      return null;
    } else {
      throw new Error();
    }
  }

  // ======================================================
  // POST a new course - problems? throw error
  async createCourse(course, emailAddress, password) {
    const res = await this.api("/courses", "POST", course, true, {
      emailAddress,
      password,
    });

    if (res.status === 201) {
      return [];
    } else if (res.status === 400) {
      return res.json().then((data) => {
        return data.errors;
      });
    } else {
      throw new Error();
    }
  }

  // ======================================================
  // PUT data to ID'd course
  async updateCourse(course, emailAddress, password) {
    const res = await this.api(`/courses/${course.id}`, "PUT", course, true, {
      emailAddress,
      password,
    });

    if (res.status === 204) {
      return [];
    } else if (res.status === 400) {
      return res.json().then((data) => {
        return data.errors;
      });
    } else {
      throw new Error();
    }
  }

  // ======================================================
  // DELETE an ID'd course
  async deleteCourse(courseId, emailAddress, password) {
    const res = await this.api(`/courses/${courseId}`, "DELETE", null, true, {
      emailAddress,
      password,
    });
    if (res.status === 204) {
      return [];
    } else if (res.status === 401) {
      return res.json().then((data) => data);
    } else {
      throw new Error();
    }
  }
}
