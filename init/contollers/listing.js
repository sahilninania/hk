const Listing = require("../../models/listing.js");

// INDEX ROUTE  (yaha route isse liye likha hai kyuki ye finctionality routes mai listing.js mai hi jaengi).
module.exports.index = async (req,res) => {                     // here index means inder route, check listing.js of routes
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings, searchQuery: {}});
};

// SEARCH ROUTE
module.exports.searchListings = async (req, res) => {
    try {
        const { title } = req.query;
        let searchFilter = {};

        // Search by title only
        if (title && title.trim()) {
            searchFilter.title = { $regex: title, $options: "i" }; // case-insensitive search
        }

        const searchResults = await Listing.find(searchFilter);
        res.render("listings/index.ejs", { allListings: searchResults, searchQuery: { title } });
    } catch (err) {
        res.render("listings/index.ejs", { allListings: [], searchQuery: {}, error: "Error during search" });
    }
};

// EXPLORE ROUTE
module.exports.exploreListing = async (req, res) => {
    try {
        const { title, category, mode, status, sort } = req.query;
        let filter = {};
        if (title && title.trim()) {
            filter.title = { $regex: title.trim(), $options: 'i' };
        }
        if (category) {
            const categories = Array.isArray(category) ? category : [category];
            filter.category = { $in: categories };
        }
        if (mode) {
            const modes = Array.isArray(mode) ? mode : [mode];
            filter.mode = { $in: modes };
        }
        if (status) {
            const statuses = Array.isArray(status) ? status : [status];
            filter.status = { $in: statuses };
        }

        let query = Listing.find(filter);
        let sortBy = sort || 'recent';
        let sortObj = { _id: -1 }; // default: recently added
        if (sortBy === 'date') sortObj = { date: 1 };
        // 'popular' and 'prize' can be enhanced later; keep default for now
        query = query.sort(sortObj);

        const allListings = await query.exec();
        const searchQuery = {
            title: title || '',
            categories: category ? (Array.isArray(category) ? category : [category]) : [],
            modes: mode ? (Array.isArray(mode) ? mode : [mode]) : [],
            statuses: status ? (Array.isArray(status) ? status : [status]) : [],
            sortBy: sortBy
        };
        res.render("listings/explore.ejs", { allListings, searchQuery });
    } catch (err) {
        console.error(err);
        const allListings = await Listing.find({});
        res.render("listings/explore.ejs", { allListings, searchQuery: {} });
    }
};

// NEW ROUTE
module.exports.renderNewForm = (req,res) =>{
    res.render("listings/new.ejs")
};

// SHOW ROUTE
module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    id = id.trim();                             // we use this because when we are getting id from id.params it is just a string coming from the url so sometimes get unwanted spaces.
    const listing = await Listing.findById(id).populate({ 
        path : "reviews", 
        populate : "author",
    })
    .populate("owner");     //ab jo bhi id ke basis pr data aega usse hum show.ejs ko paas kr denge. populate("reviews") se listingSchema mai jo reviews hai ab vo pure reviews hi print honge.
    if(!listing) {
        req.flash("error", "Listing you are trying for, does not exist!");
        return res.redirect("/listings");      // we have to put "return" here to stop the execution afterwards
    }
    res.render("listings/show.ejs", {listing});
};

// CREATE ROUTE
module.exports.createListing = async (req,res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;      // jb new listing create ho tho jis user ne login kiya ho vhi user uska owner ho.
    newListing.image = {url, filename};   // yaha pr image mai hum url aur filename daal rhe hai.
    await newListing.save();
    req.flash("success", "New Listing Created");              // isko hum vaha likhte hai jaha pr hamme flash msg print karwana hota hai
    res.redirect("/listings")
};

// EDIT ROUTE
module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    id = id.trim(); 
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you are trying for, does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;             // store the current image’s URL from the listing into a variable called originalImageUrl.
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");       // w_250 means width is 250.
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

// UPDATE ROUTE
module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

// DELETE ROUTE
module.exports.destroyListing = async (req,res) => {
    let{id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};