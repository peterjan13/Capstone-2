const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController.js");
const auth = require("../auth.js");

// User registration
router.post("/register", (request, response) => {
  UserController.registerUser(request.body).then((result) => {
    response.send(result);
  });
});

// User authentication
router.post("/login", (request, response) => {
  UserController.loginUser(request, response);
});

// Retrieve single user details
router.post("/details", auth.verify, (request, response) => {
  UserController.getProfile(request.body).then((result) => {
    response.send(result);
  });
});

// Set user as admin (Admin only)
router.put(
  "/set-admin/:id",
  auth.verify,
  auth.verifyAdmin,
  (request, response) => {
    UserController.setAdmin(request.params.id).then((result) => {
      response.send(result);
    });
  }
);

// Set user as non-admin (Admin only)
router.put(
  "/set-non-admin/:id",
  auth.verify,
  auth.verifyAdmin,
  (request, response) => {
    UserController.setNonAdmin(request.params.id).then((result) => {
      response.send(result);
    });
  }
);

// Retrieve details of all users (Admin only)
router.get("/all-users", auth.verify, auth.verifyAdmin, (request, response) => {
  UserController.getAllUsers(request, response);
});

module.exports = router;
