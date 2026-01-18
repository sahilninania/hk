const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); 


// POST REVIEW ROUTE :- to add a new review
module.exports.createReview = async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);      // request ki body ko jo review aaenge vo hum newReview ko pass kr rhe hai. Ye jo show.ejs ke form mai kr column mai name = review[comment], aur name = review[rating], yaha se lenge.
    newReview.author = req.user._id;           // jo user ki id hogi vhi hamara newReview ka author hoga.
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);
};

// DELETE REVIEW ROUTE
module.exports.destroyReview = async(req,res) => {
    let { id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});  // $pull simply means remove karna. Yaha pr jb hum kisi review ko delete kr rhe hai tb hum keh rhe hai ki jo Listing mai reviews array hai agr vo reviewId se match ho jaye tho uss pure review array ko remove kr do.
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
};