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

/*
 * Register route
 */
router.post("/register", trimRequest.all, validateRegister, AuthService.register);

/*
 * Login route
 */
router.post("/login", trimRequest.all, validateLogin, AuthService.login);

/*
 * Login route
 */
router.put("/:userId", trimRequest.all, requireAuth, AuthService.updateUser);

module.exports = router;