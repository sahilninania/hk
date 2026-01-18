const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../contollers/listing.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")                 // router.route("/") → /listings
    .get(wrapAsync(listingController.index))     // INDEX ROUTE    
    .post(isLoggedIn, upload.single("listing[image][url]"), validateListing, wrapAsync(listingController.createListing));           // CREATE ROUTE

// SEARCH ROUTE - Must be before /:id route
router.get("/search/results", wrapAsync(listingController.searchListings));

// NEW ROUTE   :- Ye SHOW ROUTE se upr issi liye likha hai kyuki fir /listings/new mai new ko show route ek id samjh raha hai.
router.get("/new", isLoggedIn , listingController.renderNewForm);

// EXPLORE ROUTE - Must be before /:id route
router.get("/explore", wrapAsync(listingController.exploreListing));

router.route("/:id")
    .get( wrapAsync(listingController.showListing))         // SHOW ROUTE
    .put(isLoggedIn, isOwner, upload.single("listing[image][url]") , validateListing, wrapAsync(listingController.updateListing))   // UPDATE ROUTE
    .delete(isLoggedIn, isOwner , wrapAsync(listingController.destroyListing));     // DELETE ROUTE

// EDIT ROUTE
router.get("/:id/edit",isLoggedIn, isOwner , wrapAsync(listingController.renderEditForm));


module.exports = router;