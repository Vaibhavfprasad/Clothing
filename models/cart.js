const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Link cart to a user
        required: true
    },
    items: [
        {
            listing: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Listing", // Reference the Listing model
                required: true
            },
            quantity: { type: Number, default: 1 },
            size: { type: String, required: true } // Store selected size
        }
    ],
    totalPrice: { type: Number, default: 0 }
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
