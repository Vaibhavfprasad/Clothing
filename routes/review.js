const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review =  require("../models/review.js");
const {validateReview,isLoggedIn,isReviewAuther} = require("../middleware.js");



//Reviews
//Post route
router.post("/",isLoggedIn,validateReview,wrapAsync(async (req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new Review Saved.");
    req.flash("success", "Your Review Added");
    res.redirect(`/listings/${listing._id}`);
}));


//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuther,wrapAsync(async (req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{ $pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Your Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;