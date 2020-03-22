"use strict";
// requires
const express = require("express");
const auth = require("basic-auth");
const bcryptjs = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const { User, Course } = require("../models").models;

// Const vars
const router = express.Router();

// I'd like to seperate asyncHandler and authenticateUser
// into a seperate module, and have a users route module
//  and a courses route module... but I dont know how
// so I'll just put everything here to be DRY

// ========================================================
// error wrapper function
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

// ========================================================
// Authentication from earlier lesson
const authenticateUser = async (req, res, next) => {
  let message = null; // initialize message
  // get the db user info and parse the Authorization Header
  const credentials = auth(req);

  // If the user's credentials are available, get user from data
  if (credentials) {
    // store all data in users, then get specific user
    const users = await User.findAll();
    const user = users.find(user => user.emailAddress === credentials.name);

    // If user was retrieved, compare password with hashed password...
    if (user) {
      const authenticated = bcryptjs.compareSync(
        credentials.pass,
        user.password
      );

      // If the passwords match, store user in req for further access
      if (authenticated) {
        console.log(`Authentication successful for ${user.emailAddress}`);
        req.currentUser = user;
      } else {
        // Set an error message if something went wrong
        message = `Authentication failure for ${user.emailAddress}`;
      }
    } else {
      message = `User not found: ${credentials.name}`;
    }
  } else {
    message = "Auth header not found";
  }

  // If user authentication failed, return the error message
  if (message) {
    console.warn(message);
    res.status(401).json({ message: "Access denied" });
  } else {
    // user authentication succeeded...
    next();
  }
};

// ======== USERS ROUTES ===================================
// GET USER Route * * WORKING * *
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress
    });
  })
);

// NEW USER Route * * WORKING * *
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      res.status(400).json({ errors: errorMessages });
    } else {
      // get the user from the request body
      const user = req.body;
      user.password = bcryptjs.hashSync(user.password);
      // create user in database
      await User.create(user);
      // set status to 201, send to root and end
      res
        .status(201)
        .location("/")
        .end();
    }
  })
);

// ======== COURSES ROUTES ===================================
// get Courses route * * * WORKING * * *
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"]
          }
        }
      ]
    });
    res.json(courses);
  })
);

// get Course route * * * WORKING * * *
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"]
          }
        }
      ]
    });
    res.status(200).json(course);
  })
);

// Create Course Route * * * WORKING * * *
router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.create(req.body);
      res
        .status(201)
        .location("/courses/" + course.id)
        .end();
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const svError = error.errors.map(err => err.message);
        res.status(400).json({ svError });
        console.error("Sequelize Validation Error creating course: ", svError);
      } else {
        console.log(
          "Something has gone terribly wrong! Sorry... that's all I know."
        );
        throw error;
      }
    }
  })
);

// Update Course route * * * WORKING * * *
// use validation .check from Unit 9 lesson
router.put(
  "/courses/:id",
  authenticateUser,
  [
    check("title")
      .exists()
      .withMessage("You must provide a course title."),
    check("description")
      .exists()
      .withMessage("You must provide a course description"),
    check("userId")
      .exists()
      .withMessage("You must provide a User ID")
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      res.status(400).json({ errors: errorMessages });
    } else {
      const user = req.currentUser;
      const course = await Course.findByPk(req.params.id);
      if (user.id === course.userId) {
        await course.update(req.body);
        res.status(204).end();
      } else {
        res
          .status(403)
          .json({ message: "User not authorized to make changes." });
      }
    }
  })
);

// Delete Course route * * * WORKING * * *
router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    const user = req.currentUser;
    const course = await Course.findByPk(req.params.id);
    if (course) {
      if (user.id === course.userId) {
        await course.destroy();
        res.status(204).end();
      } else {
        res
          .status(403)
          .json({ message: "User not authorized to delete this course." });
      }
    } else {
      next();
    }
  })
);

// EXPORTS
module.exports = router;
