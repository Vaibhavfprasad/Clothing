const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review =  require("../models/review.js");
const {validateReview,isLoggedIn,isReviewAuther} = require("../middleware.js");
const controllers = require("../controllers/reviews.js");


//Reviews
//Post route
router.post("/",isLoggedIn,validateReview,wrapAsync(controllers.createReview));


//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuther,wrapAsync(controllers.destroyReview));

module.exports = router;