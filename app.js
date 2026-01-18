const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Import routes
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const User = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

// Session and Flash setup
const sessionOptions = {
    secret: "thisismysecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
};
app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) return done(null, false, { message: 'User not found' });
        if (user.password !== password) return done(null, false, { message: 'Wrong password' });
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success").length > 0 ? req.flash("success")[0] : null;
    res.locals.error = req.flash("error").length > 0 ? req.flash("error")[0] : null;
    res.locals.currUser = req.user;
    next();
});

main()
    .then(()=>
    console.log("connected to db"))
    .catch(err=>console.log(err));
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/eventrix");
}

// Use routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

//root route    
app.get("/", (req,res)=>{
    res.redirect("/listings");
})

app.listen(8080,()=>{
    console.log("Server is running on port 8080");
})