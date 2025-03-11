const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const controllers = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//index route
//create route
router.route("/")
.get(wrapAsync(controllers.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(controllers.createListing));

//Mens Collection Route
router.get("/menscollection",async(req,res)=>{
    const allListings = await Listing.find({category: "Men"});
    res.render("collections/mens.ejs",{allListings});
})


//Women Collections Route
router.get("/womenscollection",async(req,res)=>{
    const allListings = await Listing.find({category: "Women"});
    res.render("collections/womens.ejs",{allListings});
});


//new route
router.get("/new",isLoggedIn,controllers.renderNewForm);


//read,show route
//update route
//Delete route
router.route("/:id")
.get(wrapAsync(controllers.showListing ))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(controllers.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(controllers.destroyRoute));


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,controllers.renderEditForm);


module.exports = router;