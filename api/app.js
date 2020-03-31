"use strict";

// load modules
const express = require("express");
const morgan = require("morgan");
const { sequelize } = require("./models");
const bodyParser = require("body-parser");
const cors = require("cors");
// route module
const routes = require("./routes/routes");

// variable to enable global error logging
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

// create the Express app
const app = express();

// setup to use morgan, urlencoded and bodyParser
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api", routes);
app.use(cors());

// access db
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const svError = error.errors.map(err => err.message);
      console.error("Sequelize Validation Error: ", svError);
    } else {
      console.log("Something went wrong! Sorry... that's all I know.");
      throw error;
    }
  }
})();

// setup a friendly greeting for the root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the REST API project!"
  });
});

// No route match... so 404 Not Found
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found"
  });
});

// *** ERROR HANDLER ***
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }
  // hack
  if (err.message === "Illegal arguments: undefined, string") {
    err.message = "Bad Request";
  }
  res.status(err.status || 400).json({
    message: err.message,
    error: {}
  });
});

// set our port
app.set("port", process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get("port"), () => {
  // visual cue for top of terminal output
  console.log("* * * * * * * * * * * * * * * * * * * * * * *");
  console.log(`Express server is listening on port ${server.address().port}`);
});
