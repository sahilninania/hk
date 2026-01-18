const User = require("../../models/user.js");


//SIGNUP

module.exports.renderSignupForm = (req, res) => {
    res.render("users/sigup.ejs");
};

module.exports.signup = async(req, res, next) => {
    try{
        let { username, email, password, fullName, phone, university } = req.body;
        console.log("Signup attempt:", { username, email, fullName });
        
        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            req.flash("error", "Username or email already exists!");
            return res.redirect("/signup");
        }
        
        const newUser = new User({ email, username, fullName, phone, university, password });
        const savedUser = await newUser.save();
        console.log("User saved:", savedUser._id);
        
        req.login(savedUser, (err) => {
            if(err) {
                console.log("Login error:", err);
                req.flash("error", "Login failed after registration");
                return res.redirect("/signup");
            } 
            console.log("User logged in successfully");
            req.flash("success", "✓ Registration successful! Welcome to Eventrix!");
            res.redirect("/listings");
        })
        
    } catch(err) {
        console.log("Signup error:", err);
        req.flash("error", err.message);
        res.redirect("/signup");
    } 
};

// LOGIN

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
        req.flash("success", "✓ Welcome back to Eventrix!");
        let redirectUrl = res.locals.redirectUrl || "/listings";       // If user had a stored URL (res.locals.redirectUrl), go back there.Example: /listings/new → so they can continue creating their listing. Otherwise, default to /listings.
        res.redirect(redirectUrl);
};

// LOGOUT

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {                // This method is provided by Passport.js.
        if(err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};