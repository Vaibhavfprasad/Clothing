const Listing = require("../models/listing");

module.exports.index = async (req ,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path :"reviews",populate: {path: "author",},}).populate("owner");
    if(!listing){
        req.flash("error", "Listing You Requested Does Not Exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

// module.exports.createListing = async (req, res)=>{
//     let url = req.file.path;
//     let filename = req.file.filename;
//     const newListing = new Listing(req.body.listing);
//     newListing.image = {url, filename};
//     newListing.owner = req.user._id;
//     await newListing.save();
//     req.flash("success", "New Listing Created!");
//     res.redirect("/listings");
// };


// module.exports.createListing = async (req, res) => {
//     try {
//         let images = req.files.map(file => ({ url: file.path, filename: file.filename })); // Handle multiple images

//         const newListing = new Listing({
//             ...req.body.listing,
//             images: images, // Store multiple images in the database
//             owner: req.user._id
//         });

//         await newListing.save();
//         req.flash("success", "New Listing Created!");
//         res.redirect("/listings");
//     } catch (error) {
//         console.error(error);
//         req.flash("error", "Something went wrong!");
//         res.redirect("/listings/new");
//     }
// };



module.exports.createListing = async (req, res) => {
    try {
        let images = req.files.map(file => ({ url: file.path, filename: file.filename })); // Handle multiple images

        let sizes = req.body.listing.sizes; 
        if (typeof sizes === "string") {
            sizes = JSON.parse(sizes); // Convert JSON string to an array
        }

        const newListing = new Listing({
            ...req.body.listing,
            sizes, // Store sizes correctly as an array
            images, // Store multiple images
            owner: req.user._id
        });

        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong!");
        res.redirect("/listings/new");
    }
};




module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing You Requested Does Not Exist!");
        res.redirect("/listings");
    }
    // let originalImageUrl = listing.images.url;
    // originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
    
    res.render("listings/edit.ejs",{listing});
};

// module.exports.updateListing = async (req, res)=>{
//     let {id} = req.params;
//     let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     if(typeof req.file != "undefined"){
//         let url = req.file.path;
//         let filename = req.file.filename;
//         listing.image = {url, filename};
//         await listing.save();
//     }
//     req.flash("success", "Listing Updated!");
//     res.redirect(`/listings/${id}`);
// };


// module.exports.updateListing = async (req, res) => {
//     try {
//         let { id } = req.params;
        
//         // Check if request body contains listing data
//         if (!req.body.listing) {
//             req.flash("error", "Invalid data provided!");
//             return res.redirect(`/listings/${id}/edit`);
//         }

//         // Update listing in DB
//         let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

//         // Handle file upload if a new image is provided
//         if (req.file) {
//             listing.image = {
//                 url: req.file.path,
//                 filename: req.file.filename
//             };
//             await listing.save();
//         }

//         req.flash("success", "Listing Updated!");
//         res.redirect(`/listings/${id}`);
//     } catch (error) {
//         console.error(error);
//         req.flash("error", "Something went wrong while updating the listing!");
//         res.redirect(`/listings/${id}/edit`);
//     }
// };


// module.exports.updateListing = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const listing = await Listing.findById(id);
//         if (!listing) return res.redirect("/listings");

//         // If new images are uploaded, replace old ones in the database
//         if (req.files?.length) {
//             listing.images = req.files.map(({ path, filename }) => ({ url: path, filename }));
//         }

//         // Save updated listing
//         await listing.save();

//         req.flash("success", "Listing updated with new images!");
//         res.redirect(`/listings/${id}`);
//     } catch (error) {
//         console.error(error);
//         req.flash("error", "Update failed.");
//         res.redirect(`/listings/${id}/edit`);
//     }
// };


module.exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        let { sizes } = req.body.listing;

        // Ensure sizes is stored as an array
        if (typeof sizes === "string") {
            sizes = JSON.parse(sizes);
        }

        const listing = await Listing.findByIdAndUpdate(id, {
            ...req.body.listing, // Update all other fields
            sizes, // Ensure sizes is updated correctly
        });

        if (!listing) {
            req.flash("error", "Listing not found.");
            return res.redirect("/listings");
        }

        // If new images are uploaded, replace old ones
        if (req.files?.length) {
            listing.images = req.files.map(({ path, filename }) => ({ url: path, filename }));
        }

        await listing.save(); // Save the changes

        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error(error);
        req.flash("error", "Update failed.");
        res.redirect(`/listings/${id}/edit`);
    }
};




module.exports.destroyRoute = async (req,res)=>{
    let {id} = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

