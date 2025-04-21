const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const { auth, isAdmin, isRestaurant } = require('../middleware/auth');

// Get all restaurants
router.get('/', async (req, res) => {
    try {
        const { cuisine, search, sort } = req.query;
        let query = {};

        // Filter by cuisine
        if (cuisine) {
            query.cuisine = cuisine;
        }

        // Search by name, description, or cuisine
        if (search) {
            query.$text = { $search: search };
        }

        // Sort options
        let sortOption = {};
        if (sort) {
            switch (sort) {
                case 'rating':
                    sortOption = { rating: -1 };
                    break;
                case 'deliveryTime':
                    sortOption = { 'deliveryTime.min': 1 };
                    break;
                case 'price':
                    sortOption = { 'menu.price': 1 };
                    break;
                default:
                    sortOption = { name: 1 };
            }
        }

        const restaurants = await Restaurant.find(query)
            .sort(sortOption)
            .select('-menu');

        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
    }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching restaurant', error: error.message });
    }
});

// Create new restaurant (admin/restaurant only)
router.post('/', auth, isRestaurant, async (req, res) => {
    try {
        const restaurant = new Restaurant({
            ...req.body,
            owner: req.user._id
        });
        await restaurant.save();
        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: 'Error creating restaurant', error: error.message });
    }
});

// Update restaurant (owner/admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Check if user is owner or admin
        if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this restaurant' });
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedRestaurant);
    } catch (error) {
        res.status(500).json({ message: 'Error updating restaurant', error: error.message });
    }
});

// Delete restaurant (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting restaurant', error: error.message });
    }
});

// Add menu item (owner only)
router.post('/:id/menu', auth, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        if (restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this restaurant' });
        }

        restaurant.menu.push(req.body);
        await restaurant.save();

        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: 'Error adding menu item', error: error.message });
    }
});

// Update menu item (owner only)
router.put('/:id/menu/:itemId', auth, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        if (restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this restaurant' });
        }

        const menuItem = restaurant.menu.id(req.params.itemId);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        Object.assign(menuItem, req.body);
        await restaurant.save();

        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: 'Error updating menu item', error: error.message });
    }
});

// Delete menu item (owner only)
router.delete('/:id/menu/:itemId', auth, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        if (restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this restaurant' });
        }

        restaurant.menu.pull(req.params.itemId);
        await restaurant.save();

        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting menu item', error: error.message });
    }
});

module.exports = router; 