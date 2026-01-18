const express = require("express");
const router = express.Router({ mergeParams : true });        //means “create a new router and make sure it can access the route parameters from its parent.” It is basically used for id of parent.
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); 
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../contollers/review.js");

// REVIEWS :-

// POST REVIEW ROUTE :- to add a new review
router.post("/", isLoggedIn , validateReview, wrapAsync(reviewController.createReview));

// DELETE REVIEW ROUTE
router.delete("/:reviewId", isLoggedIn, isReviewAuthor , wrapAsync(reviewController.destroyReview));

module.exports = router;