const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");





module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error","your must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.isAdmin=async (req,res,next)=>{
    if(!req.user.admin){
        req.flash("error","Your are Admin of Company.");
        return res.redirect(`/listings`);
    }
    next();
}

module.exports.saveRedirectUrl=(req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
      }
    next();
};


module.exports.isOwner=async (req, res, next)=>{
    let{id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","Your are Not the Owner of this Listing.");
       return res.redirect(`/listings/${id}`);
    }
    next();
};




module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let erMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,erMsg);
    }else{
        next();
    }
};



module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let erMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,erMsg);
    }else{
        next();
    }
};


module.exports.isReviewAuther = async(req, res, next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You ara not the Auther of this Review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}