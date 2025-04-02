const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

// Add an item to the cart
router.post("/cart/add/:listingId", isLoggedIn, async (req, res) => {
    try {
        const { listingId } = req.params;
        const { size, quantity } = req.body;
        const userId = req.user._id;

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalPrice: 0 });
        }

        const listing = await Listing.findById(listingId);
        if (!listing) {
            req.flash("error", "Item not found!");
            return res.redirect("/listings");
        }

        // Check if item is already in cart
        const existingItem = cart.items.find(
            item => item.listing.equals(listingId) && item.size === size
        );

        if (existingItem) {
            existingItem.quantity += parseInt(quantity);
        } else {
            cart.items.push({
                listing: listingId,
                size,
                quantity: parseInt(quantity)
            });
        }

        // Update total price
        cart.totalPrice = cart.items.reduce((total, item) => {
            return total + item.quantity * listing.price;
        }, 0);

        await cart.save();
        req.flash("success", "Item added to cart!");
        res.redirect("/cart");
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not add item to cart.");
        res.redirect("/listings");
    }
});

// View Cart
router.get("/cart", isLoggedIn, async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.listing");
    res.render("listings/cart.ejs", { cart });
});

// Remove Item from Cart
router.post("/cart/remove/:itemId", isLoggedIn, async (req, res) => {
    const { itemId } = req.params;
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.listing"); // Ensure items are populated

    if (cart) {
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);

        // Recalculate total price safely
        cart.totalPrice = cart.items.reduce((total, item) => {
            let price = item.listing?.price || 0; // Ensure price is valid
            let quantity = item.quantity || 1; // Ensure quantity is valid
            return total + price * quantity;
        }, 0);

        // If cart is empty, set totalPrice to 0
        if (cart.items.length === 0) {
            cart.totalPrice = 0;
        }

        await cart.save();
    }

    req.flash("success", "Item removed from cart.");
    res.redirect("/cart");
});



// Checkout route
router.post("/checkout", (req, res) => {
    req.flash("success", "Order Not Placed Because We Don't Have any Funding."); // Flash message
    res.redirect("/cart"); // Redirect back to the cart page or order confirmation page
});


module.exports = router;
