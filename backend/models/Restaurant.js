const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: String,
    available: {
        type: Boolean,
        default: true
    }
});

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    phone: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cuisine: [String],
    rating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    deliveryTime: {
        min: Number,
        max: Number
    },
    minimumOrder: {
        type: Number,
        default: 0
    },
    deliveryFee: {
        type: Number,
        default: 0
    },
    menu: [menuItemSchema],
    images: [String],
    isOpen: {
        type: Boolean,
        default: true
    },
    openingHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

restaurantSchema.index({ name: 'text', description: 'text', cuisine: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema); 