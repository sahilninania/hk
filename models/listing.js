const mongoose = require("mongoose");
const Schema = mongoose.Schema;          // Ye line hamne apni comfertability ke liye likhi hai taki hame aage mongoose.schema na likhna pade
const Review = require("./review.js");

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    category : {
        type : String,
        enum : ["Tech", "Sports", "Cultural", "Workshop"],
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    mode : {
        type : String,
        enum : ["Online", "Offline", "Hybrid"],
        required : true
    },
    location : {
        type : String,
        required : true
    },
    prize : {
        type : String,
        required : true
    },
    teamSize : {
        type : String,
        required : true
    },
    theme : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ["Open", "Closing Soon", "Upcoming"],
        required : true
    },
    image : {
        type : String,
        default : "https://via.placeholder.com/400x300"
    },
    reviews : [
        {
        type : Schema.Types.ObjectId,
        ref : "Review"
        },
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
});

listingSchema.post("findOneAndDelete", async(listing) => {   // async ke andar vo listing aaegi jo delete hone wali hai.
    if(listing) {
        await Review.deleteMany({ _id : {$in : listing.reviews} });     // Ye vo saare reviews ko delete kr dega jinki id listing.reviews mai hogi jb hum kisi listing ko delete karenge
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;