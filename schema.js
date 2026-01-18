const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        category : Joi.string().valid('Tech', 'Sports', 'Cultural', 'Workshop').required(),
        date : Joi.date().required(),
        mode : Joi.string().valid('Online', 'Offline', 'Hybrid').required(),
        location : Joi.string().required(),
        prize : Joi.string().required(),
        teamSize : Joi.string().required(),
        theme : Joi.string().required(),
        status : Joi.string().valid('Open', 'Closing Soon', 'Upcoming').required(),
        image : Joi.string().allow("", null),
    }).required(),
});


module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),  
    }).required(),
});


//Mongoose schema (review.js, listing.js)

//Defines how data is stored in MongoDB and enforces constraints at the database level.


// Joi schema (schema.js)

//Used for validating user input before it reaches the database.
// It works at the request layer (Express middleware).