// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

// Initialize cart count from localStorage when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count badge from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cartItems.length;
    }
});

hamburger.addEventListener('click', () => {
    // Create mobile menu if it doesn't exist
    if (!document.querySelector('.mobile-menu')) {
        const mobileMenu = document.createElement('div');
        mobileMenu.classList.add('mobile-menu');
        
        // Clone nav links
        const navLinksClone = navLinks.cloneNode(true);
        
        // Add login and signup buttons
        const authButtons = document.createElement('div');
        authButtons.classList.add('mobile-auth');
        authButtons.innerHTML = `
            <a href="#" class="login-btn">Login</a>
            <a href="#" class="signup-btn">Sign Up</a>
        `;
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.classList.add('close-menu');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.addEventListener('click', () => {
            document.querySelector('.mobile-menu').classList.remove('active');
            body.classList.remove('no-scroll');
        });
        
        // Append everything to mobile menu
        mobileMenu.appendChild(closeBtn);
        mobileMenu.appendChild(navLinksClone);
        mobileMenu.appendChild(authButtons);
        body.appendChild(mobileMenu);
    }
    
    // Toggle mobile menu
    document.querySelector('.mobile-menu').classList.add('active');
    body.classList.add('no-scroll');
});

// Category tabs functionality
const categoryTabs = document.querySelectorAll('.category-tab');
const restaurants = document.querySelectorAll('.restaurant');

categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        categoryTabs.forEach(tab => tab.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        const category = tab.dataset.category;
        
        // Show/hide restaurants based on category
        restaurants.forEach(restaurant => {
            if (category === 'all' || restaurant.dataset.category === category) {
                restaurant.style.display = 'block';
            } else {
                restaurant.style.display = 'none';
            }
        });
    });
});

// Add to cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartCount = document.querySelector('.cart-count');

let cartItems = 0;

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        cartItems++;
        cartCount.textContent = cartItems;
        
        // Show added to cart notification
        const notification = document.createElement('div');
        notification.classList.add('cart-notification');
        notification.textContent = 'Item added to cart!';
        body.appendChild(notification);
        
        // Remove notification after 2 seconds
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
        
        // Animation for the button
        button.classList.add('added');
        setTimeout(() => {
            button.classList.remove('added');
        }, 300);
    });
});

// Search functionality
const searchInput = document.querySelector('.search-container input');
const searchButton = document.querySelector('.search-container button');

searchButton.addEventListener('click', () => {
    const address = searchInput.value.trim();
    if (address !== '') {
        // Normally would send this to a backend
        // For now, just show a notification
        const notification = document.createElement('div');
        notification.classList.add('search-notification');
        notification.textContent = `Searching restaurants near: ${address}`;
        body.appendChild(notification);
        
        // Scroll to restaurants section
        document.getElementById('restaurants').scrollIntoView({ behavior: 'smooth' });
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});

// Allow search with Enter key
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

// Smooth scroll for navigation links
const navAnchors = document.querySelectorAll('nav a[href^="#"]');

navAnchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        
        // If mobile menu is open, close it
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });
});

// Animations on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.step, .restaurant, .dish');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.classList.add('animate');
        }
    });
};

// Initial check for elements in view
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);

// Add CSS for the elements created by JS
const style = document.createElement('style');
style.textContent = `
    .mobile-menu {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--white-color);
        z-index: 2000;
        padding: 50px 30px;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        overflow-y: auto;
    }
    
    .mobile-menu.active {
        transform: translateX(0);
    }
    
    .close-menu {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        font-size: 24px;
        color: var(--dark-color);
    }
    
    .mobile-menu .nav-links {
        flex-direction: column;
        margin-top: 50px;
    }
    
    .mobile-menu .nav-links a {
        font-size: 20px;
        margin-bottom: 20px;
    }
    
    .mobile-auth {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-top: 30px;
    }
    
    .mobile-auth a {
        text-align: center;
        padding: 12px;
        border-radius: 5px;
    }
    
    .no-scroll {
        overflow: hidden;
    }
    
    .cart-notification, .search-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: var(--white-color);
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: var(--shadow);
        opacity: 1;
        transition: opacity 0.3s ease;
        z-index: 2000;
    }
    
    .cart-notification.hide, .search-notification.hide {
        opacity: 0;
    }
    
    .add-to-cart.added {
        transform: scale(1.2);
    }
    
    .step.animate, .restaurant.animate, .dish.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .step, .restaurant, .dish {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
`;

document.head.appendChild(style);

// Set hero background image from data attribute
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    if (hero) {
        const bgImage = hero.getAttribute('data-bg-image');
        if (bgImage) {
            hero.style.backgroundImage = `url('img/${bgImage}')`;
        }
    }
});

// Modal functionality
const modals = {
    login: document.getElementById('loginModal'),
    signup: document.getElementById('signupModal')
};

const modalTriggers = {
    login: document.querySelector('.login-btn'),
    signup: document.querySelector('.signup-btn')
};

// Handle cart icon clicks separately to ensure consistent behavior
document.addEventListener('DOMContentLoaded', function() {
    // Add direct click handler to all cart icons
    const cartIcons = document.querySelectorAll('.cart');
    cartIcons.forEach(cartIcon => {
        cartIcon.addEventListener('click', function(e) {
            // Prevent the default anchor behavior
            e.preventDefault();
            
            // Redirect to cart.html
            window.location.href = 'cart.html';
        });
    });
});

// Show/hide modals
Object.keys(modalTriggers).forEach(key => {
    if (modalTriggers[key]) {
        modalTriggers[key].addEventListener('click', (e) => {
            e.preventDefault();
            modals[key].style.display = 'block';
        });
    }
});

// Close modals
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        Object.values(modals).forEach(modal => {
            modal.style.display = 'none';
        });
    });
});

// Switch between login and signup modals
document.getElementById('showSignup').addEventListener('click', (e) => {
    e.preventDefault();
    modals.login.style.display = 'none';
    modals.signup.style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    modals.signup.style.display = 'none';
    modals.login.style.display = 'block';
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    Object.values(modals).forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Cart functionality
let cart = [];

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.length;
}

function addToCart(item) {
    cart.push(item);
    updateCartCount();
    updateCartDisplay();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const subtotalElement = document.querySelector('.subtotal span:last-child');
    const totalElement = document.querySelector('.total span:last-child');
    
    cartItems.innerHTML = '';
    let subtotal = 0;
    
    if (cart.length === 0) {
        // Show empty cart message
        cartItems.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-basket"></i>
                <p>Your cart is empty</p>
                <small>Add items to get started</small>
            </div>
        `;
    } else {
        // Add each item to the cart
        cart.forEach((item, index) => {
            subtotal += item.price;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-item" data-index="${index}">×</button>
            `;
            
            cartItems.appendChild(cartItem);
        });
    }
    
    // Update totals
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${(subtotal + 2.99).toFixed(2)}`;
    
    // Update checkout button state
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (cart.length === 0) {
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add('disabled');
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('disabled');
    }
}

// Add to cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        // Get closest restaurant node
        const item = e.target.closest('.popular-item');
        if (item) {
            // This is a popular item
            const name = item.querySelector('h3').textContent;
            const priceText = item.querySelector('.price').textContent;
            const numericPrice = priceText.replace(/[^\d.]/g, ''); // Remove currency symbol and any non-numeric chars
            const price = parseFloat(numericPrice);
            const image = item.querySelector('img').src;
            const restaurantId = item.dataset.restaurantId || 'default-restaurant';
            
            if (isNaN(price)) {
                console.error("Invalid price format:", priceText);
                return; // Don't add item with invalid price
            }
            
            // Store item in localStorage
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            
            cartItems.push({
                name: name,
                price: price,
                img: image,
                restaurant: "Popular Item", // Default restaurant name if not available
                quantity: 1
            });
            
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            // Update cart count in header
            const cartCount = document.querySelector('.cart-count');
            let count = parseInt(cartCount.textContent);
            cartCount.textContent = count + 1;
            
            // Animation for button
            button.textContent = 'Added ✓';
            button.style.background = '#2ed573';
            
            // Show added to cart notification
            const notification = document.createElement('div');
            notification.classList.add('cart-notification');
            notification.textContent = `${name} added to cart!`;
            body.appendChild(notification);
            
            // Remove notification after 2 seconds
            setTimeout(() => {
                notification.classList.add('hide');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 2000);
            
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.background = '';
            }, 1000);
        }
    });
});

// Remove from cart
document.querySelector('.cart-items').addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
        const index = parseInt(e.target.dataset.index);
        removeFromCart(index);
    }
});

// Load saved address and set up address toggle
function loadSavedAddress() {
    const savedAddress = localStorage.getItem('savedAddress');
    const savedAddressContainer = document.getElementById('savedAddressContainer');
    const savedAddressDetails = document.querySelector('.saved-address-details');
    const newAddressForm = document.getElementById('newAddressForm');
    const useNewAddressCheckbox = document.getElementById('useNewAddress');
    
    let hasAddress = false;
    
    // First check if there's a saved address
    if (savedAddress) {
        try {
            const addressData = JSON.parse(savedAddress);
            document.getElementById('deliveryStreet').value = addressData.street || '';
            document.getElementById('deliveryCity').value = addressData.city || '';
            document.getElementById('deliveryState').value = addressData.state || '';
            document.getElementById('deliveryZip').value = addressData.zipCode || '';
            
            // Display saved address in the container
            savedAddressDetails.textContent = `${addressData.street}, ${addressData.city}, ${addressData.state} ${addressData.zipCode}`;
            hasAddress = true;
        } catch (error) {
            console.error('Error loading saved address:', error);
        }
    }
    
    // If no saved address, check if user info has an address
    if (!hasAddress) {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.address && user.address.street) {
                    document.getElementById('deliveryStreet').value = user.address.street || '';
                    document.getElementById('deliveryCity').value = user.address.city || '';
                    document.getElementById('deliveryState').value = user.address.state || '';
                    document.getElementById('deliveryZip').value = user.address.zipCode || '';
                    
                    // Display saved address in the container
                    savedAddressDetails.textContent = `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zipCode}`;
                    hasAddress = true;
                }
            } catch (error) {
                console.error('Error loading user address:', error);
            }
        }
    }
    
    // If no saved address was found, show the new address form
    if (!hasAddress) {
        savedAddressContainer.style.display = 'none';
        newAddressForm.style.display = 'block';
        useNewAddressCheckbox.checked = true;
    } else {
        savedAddressContainer.style.display = 'block';
        newAddressForm.style.display = 'none';
        useNewAddressCheckbox.checked = false;
    }
    
    // Set up toggle for using new/saved address
    useNewAddressCheckbox.addEventListener('change', function() {
        if (this.checked) {
            savedAddressContainer.style.display = 'none';
            newAddressForm.style.display = 'block';
        } else {
            savedAddressContainer.style.display = 'block';
            newAddressForm.style.display = 'none';
        }
    });
}

// Checkout button
document.querySelector('.checkout-btn').addEventListener('click', async () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    try {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            // Show login modal if not authenticated
            modals.login.style.display = 'block';
            return;
        }
        
        // Get address - either saved or new
        const useNewAddress = document.getElementById('useNewAddress').checked;
        let street, city, state, zipCode;
        
        if (useNewAddress) {
            // Get values from the new address form
            street = document.getElementById('deliveryStreet').value.trim();
            city = document.getElementById('deliveryCity').value.trim();
            state = document.getElementById('deliveryState').value.trim();
            zipCode = document.getElementById('deliveryZip').value.trim();
            
            // Validate address fields
            if (!street || !city || !state || !zipCode) {
                alert('Please fill in all delivery address fields');
                return;
            }
            
            // Save the new address
            saveAddressToLocalStorage({
                street,
                city,
                state,
                zipCode
            });
        } else {
            // Use the saved address
            const savedAddress = localStorage.getItem('savedAddress');
            if (savedAddress) {
                const addressData = JSON.parse(savedAddress);
                street = addressData.street;
                city = addressData.city;
                state = addressData.state;
                zipCode = addressData.zipCode;
            } else {
                // If somehow no saved address exists, use the form values
                street = document.getElementById('deliveryStreet').value.trim();
                city = document.getElementById('deliveryCity').value.trim();
                state = document.getElementById('deliveryState').value.trim();
                zipCode = document.getElementById('deliveryZip').value.trim();
                
                // Validate address fields
                if (!street || !city || !state || !zipCode) {
                    alert('Please fill in all delivery address fields');
                    return;
                }
            }
        }
        
        const deliveryInstructions = document.getElementById('deliveryInstructions').value.trim();
        
        // Show loading state on button
        const checkoutBtn = document.querySelector('.checkout-btn');
        checkoutBtn.textContent = 'Processing...';
        checkoutBtn.disabled = true;
        
        // Prepare order data
        const orderData = {
            restaurantId: cart[0].restaurantId, // Assuming all items from same restaurant
            items: cart.map(item => ({
                menuItemId: item.id,
                quantity: 1, // Can be enhanced to track quantities
                specialInstructions: ''
            })),
            deliveryAddress: {
                street,
                city,
                state,
                zipCode
            },
            paymentMethod: 'card', // Default to card payment
            deliveryInstructions
        };
        
        // For demonstration, we'll simulate a successful order
        // In a real application, this would send a request to the backend
        let order;
        try {
            // Attempt to send to backend
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });
            
            if (response.ok) {
                order = await response.json();
            } else {
                // If server error, create a simulated order for demo purposes
                console.warn('Backend request failed, using simulated order');
                order = {
                    _id: 'ORD-' + Math.floor(Math.random() * 10000),
                    status: 'confirmed',
                    items: orderData.items,
                    deliveryAddress: orderData.deliveryAddress,
                    createdAt: new Date().toISOString()
                };
                
                // Save to localStorage for demo purposes
                const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
                savedOrders.push(order);
                localStorage.setItem('orders', JSON.stringify(savedOrders));
            }
        } catch (error) {
            console.warn('API request failed, using simulated order');
            // Create a simulated order for demo purposes
            order = {
                _id: 'ORD-' + Math.floor(Math.random() * 10000),
                status: 'confirmed',
                items: orderData.items,
                deliveryAddress: orderData.deliveryAddress,
                createdAt: new Date().toISOString()
            };
            
            // Save to localStorage for demo purposes
            const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            savedOrders.push(order);
            localStorage.setItem('orders', JSON.stringify(savedOrders));
        }
        
        // Clear cart
        cart = [];
        updateCartCount();
        
        // Always save the address that was successfully used
        saveAddressToLocalStorage({
            street,
            city,
            state,
            zipCode
        });
        
        // Show success message on the main page
        showOrderConfirmation(order, street, city, state, zipCode);
        
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Error placing order: ' + error.message);
        
        // Reset checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        checkoutBtn.textContent = 'Proceed to Checkout';
        checkoutBtn.disabled = false;
    }
});

// Function to show the order confirmation
function showOrderConfirmation(order, street, city, state, zipCode) {
    // Create overlay for order confirmation
    const overlay = document.createElement('div');
    overlay.className = 'order-confirmation-overlay';
    
    // Calculate estimated delivery time (30-45 minutes from now)
    const now = new Date();
    const estimatedDelivery = new Date(now.getTime() + (40 * 60000)); // 40 minutes
    const timeString = estimatedDelivery.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    overlay.innerHTML = `
        <div class="order-confirmation">
            <div class="order-success">
                <i class="fas fa-check-circle"></i>
                <h2>Order Placed Successfully!</h2>
                <p class="order-id">Order ID: ${order._id}</p>
                <p class="delivery-address">Delivering to: ${street}, ${city}, ${state} ${zipCode}</p>
                <p class="estimated-time">Estimated delivery: ${timeString}</p>
                <p class="thank-you">Thank you for your order!</p>
                <button class="btn-primary continue-shopping">Continue Shopping</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.classList.add('no-scroll');
    
    // Add event listener to continue shopping button
    overlay.querySelector('.continue-shopping').addEventListener('click', () => {
        overlay.remove();
        document.body.classList.remove('no-scroll');
        
        // Reset cart modal for next time
        const cartItems = document.querySelector('.cart-items');
        const cartSummary = document.querySelector('.cart-summary');
        
        updateCartDisplay();
        document.querySelector('.checkout-btn').textContent = 'Proceed to Checkout';
        document.querySelector('.checkout-btn').disabled = false;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Form submissions
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        // Implement login API call
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Invalid credentials');
        }
        
        const data = await response.json();
        
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update UI for logged in user
        updateAuthUI(true);
        
        // Close modal
        modals.login.style.display = 'none';
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
});

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    try {
        // Implement signup API call
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }
        
        const data = await response.json();
        
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update UI for logged in user
        updateAuthUI(true);
        
        // Close modal
        modals.signup.style.display = 'none';
        
        alert('Registration successful!');
    } catch (error) {
        console.error('Signup error:', error);
        alert('Registration failed: ' + error.message);
    }
});

// Function to update UI based on authentication state
function updateAuthUI(isLoggedIn) {
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    
    if (isLoggedIn) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        loginBtn.textContent = user.name;
        loginBtn.href = '#profile';
        signupBtn.textContent = 'Logout';
        signupBtn.href = '#';
        signupBtn.addEventListener('click', logout);
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.href = '#';
        signupBtn.textContent = 'Sign Up';
        signupBtn.href = '#';
        // Remove logout event listener
        const newSignupBtn = signupBtn.cloneNode(true);
        signupBtn.parentNode.replaceChild(newSignupBtn, signupBtn);
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateAuthUI(false);
}

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        updateAuthUI(true);
    }
});

// Function to add items to cart with restaurant ID
function addToCart(item) {
    cart.push(item);
    updateCartCount();
    updateCartDisplay();
}

// Initialize cart count
updateCartCount();

// Function to save the address to localStorage
function saveAddressToLocalStorage(address) {
    // If address is provided as an object, use it; otherwise get from form
    let addressData;
    
    if (address && typeof address === 'object') {
        addressData = address;
    } else {
        const street = document.getElementById('deliveryStreet').value.trim();
        const city = document.getElementById('deliveryCity').value.trim();
        const state = document.getElementById('deliveryState').value.trim();
        const zipCode = document.getElementById('deliveryZip').value.trim();
        
        if (street && city && state && zipCode) {
            addressData = { street, city, state, zipCode };
        } else {
            return; // Don't save incomplete addresses
        }
    }
    
    localStorage.setItem('savedAddress', JSON.stringify(addressData));
}

// Restaurant click
document.addEventListener('DOMContentLoaded', function() {
    // Make all restaurants clickable
    const restaurants = document.querySelectorAll('.restaurant');
    
    restaurants.forEach(restaurant => {
        if (!restaurant.querySelector('a')) {
            restaurant.style.cursor = 'pointer';
            restaurant.addEventListener('click', function() {
                window.location.href = 'restaurant.html';
            });
        }
    });

    // Category tabs functionality
    const categoryTabs = document.querySelectorAll('.category-tab');
    const restaurantElements = document.querySelectorAll('.restaurant');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Show all restaurants if 'all' is selected
            if (category === 'all') {
                restaurantElements.forEach(restaurant => {
                    restaurant.style.display = 'block';
                });
            } else {
                // Otherwise show only restaurants with matching category
                restaurantElements.forEach(restaurant => {
                    if (restaurant.getAttribute('data-category') === category) {
                        restaurant.style.display = 'block';
                    } else {
                        restaurant.style.display = 'none';
                    }
                });
            }
        });
    });
}); 