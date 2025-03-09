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


//new route
router.get("/new",isLoggedIn,controllers.renderNewForm);


//read,show route
//update route
//Delete route
router.route("/:id")
.get(wrapAsync(controllers.showListing ))
.put(isLoggedIn,isOwner, validateListing,wrapAsync(controllers.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(controllers.destroyRoute));


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,controllers.renderEditForm);


module.exports = router;