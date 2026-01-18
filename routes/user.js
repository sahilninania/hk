const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../contollers/user.js");

//SIGNUP
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

//LOGIN
router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl , passport.authenticate("local", {
    failureRedirect : "/login",
    failureFlash : true,
}) , userController.login);


//LOGOUT
router.get("/logout", userController.logout);

module.exports = router;


// passport.authenticate("local", {
//     failureRedirect : "/login",
//     failureFlash : true,
// }) 

// ye ek middleware hai aur isme Local ka matlb hai ki hum local strategy ka use kr rhe hai.
// failureRedirect : "/login" matlab agr koi bhi type ka failure aega login mai (username ya password galt hoga) tho hum "/login" pr redirect ho jaenge.
// failureFlash : true matlab agr koi failure aega tho ek message flash hoga ki kya failure hai aur ye msg passport khud bta dega ki kya failure hai. 