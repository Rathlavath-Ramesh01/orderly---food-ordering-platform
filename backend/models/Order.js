const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant.menu',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    specialInstructions: String
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    items: [orderItemSchema],
    subtotal: {
        type: Number,
        required: true
    },
    deliveryFee: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deliveryInstructions: String,
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate total before saving
orderSchema.pre('save', function(next) {
    this.total = this.subtotal + this.deliveryFee;
    next();
});

module.exports = mongoose.model('Order', orderSchema); 