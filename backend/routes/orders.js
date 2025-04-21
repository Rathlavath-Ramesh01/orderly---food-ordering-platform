const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const { auth, isRestaurant } = require('../middleware/auth');

// Create new order
router.post('/', auth, async (req, res) => {
    try {
        const { restaurantId, items, deliveryAddress, paymentMethod, deliveryInstructions } = req.body;

        // Get restaurant
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Calculate subtotal
        let subtotal = 0;
        const orderItems = items.map(item => {
            const menuItem = restaurant.menu.id(item.menuItemId);
            if (!menuItem) {
                throw new Error(`Menu item ${item.menuItemId} not found`);
            }
            subtotal += menuItem.price * item.quantity;
            return {
                menuItem: menuItem._id,
                quantity: item.quantity,
                price: menuItem.price,
                specialInstructions: item.specialInstructions
            };
        });

        // Create order
        const order = new Order({
            user: req.user._id,
            restaurant: restaurantId,
            items: orderItems,
            subtotal,
            deliveryFee: restaurant.deliveryFee,
            deliveryAddress,
            paymentMethod,
            deliveryInstructions,
            estimatedDeliveryTime: new Date(Date.now() + restaurant.deliveryTime.min * 60000)
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('restaurant', 'name')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

// Get restaurant's orders (restaurant only)
router.get('/restaurant/:restaurantId', auth, isRestaurant, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        if (restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view these orders' });
        }

        const orders = await Order.find({ restaurant: req.params.restaurantId })
            .populate('user', 'name phone')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('restaurant', 'name')
            .populate('user', 'name phone');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to view this order
        if (order.user._id.toString() !== req.user._id.toString() &&
            order.restaurant.owner.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
});

// Update order status (restaurant only)
router.patch('/:id/status', auth, isRestaurant, async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const restaurant = await Restaurant.findById(order.restaurant);
        if (restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this order' });
        }

        order.orderStatus = orderStatus;
        if (orderStatus === 'delivered') {
            order.actualDeliveryTime = new Date();
        }
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
});

// Cancel order
router.post('/:id/cancel', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to cancel this order
        if (order.user._id.toString() !== req.user._id.toString() &&
            order.restaurant.owner.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        // Only allow cancellation of pending or confirmed orders
        if (!['pending', 'confirmed'].includes(order.orderStatus)) {
            return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
        }

        order.orderStatus = 'cancelled';
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling order', error: error.message });
    }
});

module.exports = router; 