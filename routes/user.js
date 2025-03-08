const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const controllers = require("../controllers/users.js");


//GET Route signUp
router.get("/signup",controllers.renderSignupForm);

//Post Route SignUp
router.post("/signup",wrapAsync(controllers.signup));

//get Route for Login
router.get("/login",controllers.renderLoginForm);

//POST Route for Login
router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash: true,
}),controllers.login);


//Get Route for LogOut
router.get("/logout",controllers.logout);

module.exports = router;