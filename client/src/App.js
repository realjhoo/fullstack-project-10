import React, { Component } from "react";

class App extends Component {
  componentDidMount() {
    fetch("http://localhost:5000/api/courses")
      .then(req => {
        return req.json();
      })
      .then(data => {
        console.log("Course Data: ", data);
      });
  }
  render() {
    return <div>Saluton denove, mondo! </div>;
  }
}

export default App;
