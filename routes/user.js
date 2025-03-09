const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const controllers = require("../controllers/users.js");


//GET Route signUp
//Post Route SignUp
router.route("/signup")
.get(controllers.renderSignupForm)
.post(wrapAsync(controllers.signup));


//get Route for Login
//POST Route for Login
router.route("/login")
.get(controllers.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash: true,
}),controllers.login);


//Get Route for LogOut
router.get("/logout",controllers.logout);

module.exports = router;