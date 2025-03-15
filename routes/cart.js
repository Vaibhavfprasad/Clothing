const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Add item to cart
router.post('/add', async (req, res) => {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = req.session.cart || { items: [], totalPrice: 0 };

    // Check if item is already in cart
    let itemIndex = cart.items.findIndex(item => item.productId == productId);
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += parseInt(quantity);
        cart.items[itemIndex].total = cart.items[itemIndex].quantity * product.price;
    } else {
        cart.items.push({
            productId,
            name: product.name,
            price: product.price,
            quantity: parseInt(quantity),
            total: product.price * quantity
        });
    }

    // Calculate total price
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.total, 0);

    req.session.cart = cart;
    res.json({ message: "Item added to cart", cart });
});

// View cart
router.get('/', (req, res) => {
    res.json(req.session.cart || { items: [], totalPrice: 0 });
});

// Remove item from cart
router.post('/remove', (req, res) => {
    const { productId } = req.body;
    let cart = req.session.cart || { items: [], totalPrice: 0 };

    cart.items = cart.items.filter(item => item.productId != productId);
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.total, 0);

    req.session.cart = cart;
    res.json({ message: "Item removed", cart });
});

// Update item quantity
router.post('/update', (req, res) => {
    const { productId, quantity } = req.body;
    let cart = req.session.cart || { items: [], totalPrice: 0 };

    let item = cart.items.find(item => item.productId == productId);
    if (item) {
        item.quantity = parseInt(quantity);
        item.total = item.quantity * item.price;
    }

    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.total, 0);
    req.session.cart = cart;
    res.json({ message: "Cart updated", cart });
});

module.exports = router;
