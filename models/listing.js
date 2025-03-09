const mongoose = require("mongoose");
const Review = require("./review.js");
const listingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image:{
        url: String,
        filename: String,
    },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    date: { type: Date, default: Date.now(), },
    sizes: { type: Array , required : true},
    reviews: [{
        type : mongoose.Types.ObjectId,
        ref: "Review",
    },
],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete",async (listing) =>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
