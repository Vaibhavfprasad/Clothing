const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const controllers = require("../controllers/listings.js");


//index route
router.get("/",wrapAsync(controllers.index));


//new route
router.get("/new",isLoggedIn,controllers.renderNewForm);


//read,show route
router.get("/:id",wrapAsync(controllers.showListing ));


//create route
router.post("/",isLoggedIn,validateListing,wrapAsync(controllers.createListing));



//edit route
router.get("/:id/edit",isLoggedIn,isOwner,controllers.renderEditForm);

//update route
router.put("/:id",isLoggedIn,isOwner, validateListing,wrapAsync(controllers.updateListing));


//Delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(controllers.destroyRoute));


module.exports = router;