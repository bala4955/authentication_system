const express = require("express");
const router = express.Router();
const trimRequest = require("trim-request");
const { AuthService } = require("../services");
const { validateRegister, validateLogin } = require("../middlewares/validators");
require("../../config/passport");
const passport = require("passport");
const requireAuth = passport.authenticate(["jwt"], {
  session: false,
});
const { roleAuthorization } = require("../middlewares/roleAuthorization");

/*
 * Register route
 */
router.post("/auth/register", trimRequest.all, validateRegister, AuthService.register);

/*
 * Login route
 */
router.post("/auth/login", trimRequest.all, validateLogin, AuthService.login);

/*
 * Login route
 */
router.put("/:userId", trimRequest.all, requireAuth, roleAuthorization(), AuthService.updateUser);

/*
 * Get All Users
 */
router.get("/", trimRequest.all, requireAuth, AuthService.getAllUsers);

module.exports = router;