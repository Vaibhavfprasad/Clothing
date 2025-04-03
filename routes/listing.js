const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing,isAdmin} = require("../middleware.js");
const controllers = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//index route
//create route
router.route("/")
.get(wrapAsync(controllers.index))
.post(isLoggedIn,isAdmin,upload.array("listing[images]",5),validateListing,wrapAsync(controllers.createListing));


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

//For Shirt Collection
router.get("/shirtcollection",async(req,res)=>{
    const allListings = await Listing.find({subCategory: "Shirt"});
    res.render("collections/shirt.ejs",{allListings});
});



//For T-Shirt Collection
router.get("/tshirtcollection",async(req,res)=>{
    const allListings = await Listing.find({subCategory: "T-Shirt"});
    res.render("collections/shirt.ejs",{allListings});
});


//For bottom Collection
router.get("/pantcollection",async(req,res)=>{
    const allListings = await Listing.find({subCategory: "Pant"});
    res.render("collections/shirt.ejs",{allListings});
});

//For others Collection
router.get("/otherscollection",async(req,res)=>{
    const allListings = await Listing.find({subCategory: "Others"});
    res.render("collections/shirt.ejs",{allListings});
});




//new route
router.get("/new",isLoggedIn,controllers.renderNewForm);


//read,show route
//update route
//Delete route
router.route("/:id")
.get(wrapAsync(controllers.showListing ))
.put(isLoggedIn,isOwner,upload.array("listing[images]",4),validateListing,wrapAsync(controllers.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(controllers.destroyRoute));


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,controllers.renderEditForm);


module.exports = router;