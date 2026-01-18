const Listing = require("./models/listing");   
const Review = require("./models/review");   
const { listingSchema, reviewSchema } = require("./schema.js");  
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.user) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// !req.isAuthenticated() means if the user is logged in or not, if the user is not logged in then we have use "if" function.
// res.session.redirect value is stored in locals because while trying to login, we can check user.js there is passport in router.post /login wala part, passport has an inbuilt property to delete the session data when logged in so here to avoid that we save stored session in locals.


// Authorization for /listings
module.exports.isOwner = async( req, res, next ) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Joi Validation
module.exports.validateListing = (req, res, next) => {
        let {error} = listingSchema.validate(req.body);            // listingSchema.validate(req.body):- It checks whether the data inside req.body matches the schema rules (like required: true, min, max, type: String, etc.). 
        if(error) {
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(404, errMsg);
        } else {
        next();
    }
}


module.exports.validateReview = (req, res, next) => {
        let {error} = reviewSchema.validate(req.body);             
        if(error) {
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(404, errMsg);
        } else {
        next();
    }
};

// Authorization for /reviews (part 2)
module.exports.isReviewAuthor = async( req, res, next ) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};