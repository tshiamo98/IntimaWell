// cart-favorites.js - Complete cart and favorites system with Firestore sync

class CartFavoritesSystem {
    constructor() {
        this.currentUser = null;
        this.cartItems = [];
        this.favoriteItems = [];
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            // Wait for Firebase to be available
            if (!window.firebase || !window.firebase.auth) {
                console.warn('Firebase not available yet, retrying in 1 second...');
                setTimeout(() => this.init(), 1000);
                return;
            }

            // Listen for auth state changes
            firebase.auth().onAuthStateChanged(async (user) => {
                this.currentUser = user;
                if (user) {
                    // User is logged in - load their data from Firestore
                    await this.loadUserData();
                } else {
                    // User is logged out - clear data
                    this.cartItems = [];
                    this.favoriteItems = [];
                }
                // Update UI after auth state changes
                this.updateCartUI();
                this.updateFavoritesUI();
                this.isInitialized = true;
            });
        } catch (error) {
            console.error('Error initializing CartFavoritesSystem:', error);
        }
    }

    // ========== CART FUNCTIONS ==========

    async addToCart(product, quantity = 1, selectedSize = null) {
        try {
            // Wait for initialization if needed
            if (!this.isInitialized) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            if (!this.currentUser) {
                // Show login modal if not logged in
                this.showNotification('Please login to add items to cart', 'warning');
                // Open login modal
                if (window.authUI && window.authUI.showAuthModal) {
                    window.authUI.showAuthModal('login');
                }
                return false;
            }

            const cartItem = {
                productId: product.id || product.productId,
                name: product.name,
                price: parseFloat(product.price) || 0,
                quantity: parseInt(quantity) || 1,
                selectedSize: selectedSize,
                image: (product.images && product.images[0]) || product.image || '',
                addedAt: new Date().toISOString(),
                productData: product // Store complete product data for display
            };

            // Check if product already in cart (same product and same size)
            const existingIndex = this.cartItems.findIndex(
                item => item.productId === cartItem.productId && item.selectedSize === selectedSize
            );

            if (existingIndex > -1) {
                // Update quantity if already exists
                this.cartItems[existingIndex].quantity += cartItem.quantity;
                this.cartItems[existingIndex].updatedAt = new Date().toISOString();
            } else {
                // Add new item
                this.cartItems.push(cartItem);
            }

            // Save to Firestore
            await this.saveCartToFirestore();
            
            // Update UI
            this.updateCartUI();
            
            // Show notification
            this.showNotification(`${quantity} × ${product.name} added to cart`, 'success');
            
            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification('Error adding to cart', 'error');
            return false;
        }
    }

    async removeFromCart(productId, selectedSize = null) {
        try {
            if (!this.currentUser) return false;

            // Find item to remove
            const itemIndex = this.cartItems.findIndex(
                item => item.productId === productId && item.selectedSize === selectedSize
            );

            if (itemIndex > -1) {
                const removedItem = this.cartItems[itemIndex];
                this.cartItems.splice(itemIndex, 1);
                
                // Save to Firestore
                await this.saveCartToFirestore();
                
                // Update UI
                this.updateCartUI();
                
                // Show notification
                this.showNotification(`${removedItem.name} removed from cart`, 'info');
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error removing from cart:', error);
            this.showNotification('Error removing from cart', 'error');
            return false;
        }
    }

    async updateCartItemQuantity(productId, quantity, selectedSize = null) {
        try {
            if (!this.currentUser) return false;

            const itemIndex = this.cartItems.findIndex(
                item => item.productId === productId && item.selectedSize === selectedSize
            );

            if (itemIndex > -1) {
                if (quantity <= 0) {
                    // Remove if quantity is 0 or less
                    return await this.removeFromCart(productId, selectedSize);
                }

                this.cartItems[itemIndex].quantity = quantity;
                this.cartItems[itemIndex].updatedAt = new Date().toISOString();
                
                // Save to Firestore
                await this.saveCartToFirestore();
                
                // Update UI
                this.updateCartUI();
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating cart quantity:', error);
            this.showNotification('Error updating quantity', 'error');
            return false;
        }
    }

    async clearCart() {
        try {
            if (!this.currentUser) return false;

            this.cartItems = [];
            
            // Save to Firestore
            await this.saveCartToFirestore();
            
            // Update UI
            this.updateCartUI();
            
            // Show notification
            this.showNotification('Cart cleared', 'info');
            
            return true;
        } catch (error) {
            console.error('Error clearing cart:', error);
            this.showNotification('Error clearing cart', 'error');
            return false;
        }
    }

    async saveCartToFirestore() {
        if (!this.currentUser || !window.firebase) return;

        try {
            const db = firebase.firestore();
            await db.collection('carts').doc(this.currentUser.uid).set({
                userId: this.currentUser.uid,
                items: this.cartItems,
                updatedAt: new Date().toISOString(),
                itemCount: this.getCartItemCount(),
                totalAmount: this.getCartTotal()
            }, { merge: true });
        } catch (error) {
            console.error('Error saving cart to Firestore:', error);
            throw error;
        }
    }

    async loadCartFromFirestore() {
        if (!this.currentUser || !window.firebase) return;

        try {
            const db = firebase.firestore();
            const cartDoc = await db.collection('carts').doc(this.currentUser.uid).get();
            
            if (cartDoc.exists) {
                const cartData = cartDoc.data();
                this.cartItems = cartData.items || [];
                return this.cartItems;
            } else {
                this.cartItems = [];
                return [];
            }
        } catch (error) {
            console.error('Error loading cart from Firestore:', error);
            return [];
        }
    }

    // ========== FAVORITES FUNCTIONS ==========

    async toggleFavorite(product) {
        try {
            if (!this.currentUser) {
                // Show login modal if not logged in
                this.showNotification('Please login to save favorites', 'warning');
                if (window.authUI && window.authUI.showAuthModal) {
                    window.authUI.showAuthModal('login');
                }
                return false;
            }

            const isFavorite = this.isProductFavorite(product.id || product.productId);
            
            if (isFavorite) {
                await this.removeFromFavorites(product.id || product.productId);
                return false;
            } else {
                await this.addToFavorites(product);
                return true;
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            return false;
        }
    }

    async addToFavorites(product) {
        try {
            if (!this.currentUser) return false;

            const favoriteItem = {
                productId: product.id || product.productId,
                name: product.name,
                price: parseFloat(product.price) || 0,
                image: (product.images && product.images[0]) || product.image || '',
                addedAt: new Date().toISOString(),
                productData: product
            };

            // Check if already in favorites
            if (!this.isProductFavorite(favoriteItem.productId)) {
                this.favoriteItems.push(favoriteItem);
                
                // Save to Firestore
                await this.saveFavoritesToFirestore();
                
                // Update UI
                this.updateFavoritesUI();
                
                // Show notification
                this.showNotification(`${product.name} added to favorites`, 'success');
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error adding to favorites:', error);
            this.showNotification('Error adding to favorites', 'error');
            return false;
        }
    }

    async removeFromFavorites(productId) {
        try {
            if (!this.currentUser) return false;

            const itemIndex = this.favoriteItems.findIndex(item => item.productId === productId);
            
            if (itemIndex > -1) {
                const removedItem = this.favoriteItems[itemIndex];
                this.favoriteItems.splice(itemIndex, 1);
                
                // Save to Firestore
                await this.saveFavoritesToFirestore();
                
                // Update UI
                this.updateFavoritesUI();
                
                // Show notification
                this.showNotification(`${removedItem.name} removed from favorites`, 'info');
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error removing from favorites:', error);
            this.showNotification('Error removing from favorites', 'error');
            return false;
        }
    }

    async saveFavoritesToFirestore() {
        if (!this.currentUser || !window.firebase) return;

        try {
            const db = firebase.firestore();
            await db.collection('favorites').doc(this.currentUser.uid).set({
                userId: this.currentUser.uid,
                items: this.favoriteItems,
                updatedAt: new Date().toISOString(),
                itemCount: this.favoriteItems.length
            }, { merge: true });
        } catch (error) {
            console.error('Error saving favorites to Firestore:', error);
            throw error;
        }
    }

    async loadFavoritesFromFirestore() {
        if (!this.currentUser || !window.firebase) return;

        try {
            const db = firebase.firestore();
            const favoritesDoc = await db.collection('favorites').doc(this.currentUser.uid).get();
            
            if (favoritesDoc.exists) {
                const favoritesData = favoritesDoc.data();
                this.favoriteItems = favoritesData.items || [];
                return this.favoriteItems;
            } else {
                this.favoriteItems = [];
                return [];
            }
        } catch (error) {
            console.error('Error loading favorites from Firestore:', error);
            return [];
        }
    }

    // ========== HELPER FUNCTIONS ==========

    isProductFavorite(productId) {
        return this.favoriteItems.some(item => item.productId == productId);
    }

    getCartItemCount() {
        return this.cartItems.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
    }

    getCartTotal() {
        return this.cartItems.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 0;
            return total + (price * quantity);
        }, 0);
    }

    async loadUserData() {
        if (!this.currentUser) return;

        try {
            // Load cart and favorites in parallel
            await Promise.all([
                this.loadCartFromFirestore(),
                this.loadFavoritesFromFirestore()
            ]);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    showNotification(message, type = 'info') {
        // Try to use existing notification system or create a simple one
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else if (window.showNotification && typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            // Fallback to console and alert
            console.log(`${type.toUpperCase()}: ${message}`);
            if (type === 'error') {
                alert(`Error: ${message}`);
            }
        }
    }

    // ========== UI UPDATES ==========

    updateCartUI() {
        // Update cart count in header
        const cartCount = this.getCartItemCount();
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            element.textContent = cartCount;
            element.style.display = cartCount > 0 ? 'inline-block' : 'none';
        });

        // Update cart total if on cart page
        const cartTotalElement = document.getElementById('cartTotal');
        if (cartTotalElement) {
            const total = this.getCartTotal();
            cartTotalElement.textContent = `$${total.toFixed(2)}`;
        }

        // Update cart items list if on cart page
        if (document.getElementById('cartItems')) {
            this.renderCartItems();
        }
    }

    updateFavoritesUI() {
        // Update favorite buttons on product cards
        const favoriteButtons = document.querySelectorAll('.product-favorite, .favorite-btn');
        
        favoriteButtons.forEach(button => {
            const productCard = button.closest('.product-card') || button.closest('[data-id]');
            if (productCard) {
                const productId = productCard.dataset.id || productCard.dataset.productId;
                if (productId) {
                    const isFavorite = this.isProductFavorite(productId);
                    
                    const icon = button.querySelector('i') || button;
                    if (icon) {
                        if (isFavorite) {
                            icon.classList.add('active');
                            icon.style.color = 'var(--color-secondary, #ff6b6b)';
                            button.setAttribute('aria-pressed', 'true');
                            button.title = 'Remove from favorites';
                        } else {
                            icon.classList.remove('active');
                            icon.style.color = '';
                            button.setAttribute('aria-pressed', 'false');
                            button.title = 'Add to favorites';
                        }
                    }
                }
            }
        });

        // Update favorites list if on favorites page
        if (document.getElementById('favoritesList')) {
            this.renderFavoritesList();
        }
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        if (!cartItemsContainer) return;

        if (this.cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started!</p>
                    <a href="shop.html" class="btn-primary">Browse Products</a>
                </div>
            `;
            return;
        }

        let html = '';
        this.cartItems.forEach((item, index) => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 1;
            const itemTotal = price * quantity;
            
            html += `
                <div class="cart-item" data-product-id="${item.productId}" data-size="${item.selectedSize || ''}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100x100?text=Product'">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        ${item.selectedSize ? `<p class="cart-item-size">Size: ${item.selectedSize}</p>` : ''}
                        <p class="cart-item-price">$${price.toFixed(2)} each</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-action="decrease" data-product-id="${item.productId}" data-size="${item.selectedSize || ''}">-</button>
                        <input type="number" class="quantity-input" value="${quantity}" min="1" max="99" data-product-id="${item.productId}" data-size="${item.selectedSize || ''}">
                        <button class="quantity-btn increase" data-action="increase" data-product-id="${item.productId}" data-size="${item.selectedSize || ''}">+</button>
                    </div>
                    <div class="cart-item-total">
                        $${itemTotal.toFixed(2)}
                    </div>
                    <button class="cart-item-remove" data-action="remove" data-product-id="${item.productId}" data-size="${item.selectedSize || ''}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = html;
        this.attachCartItemEventListeners();
    }

    renderFavoritesList() {
        const favoritesContainer = document.getElementById('favoritesList');
        if (!favoritesContainer) return;

        if (this.favoriteItems.length === 0) {
            favoritesContainer.innerHTML = `
                <div class="empty-favorites">
                    <i class="fas fa-heart"></i>
                    <h3>No favorites yet</h3>
                    <p>Click the heart icon on products to add them here!</p>
                    <a href="shop.html" class="btn-primary">Browse Products</a>
                </div>
            `;
            return;
        }

        let html = '<div class="favorites-grid">';
        this.favoriteItems.forEach((item, index) => {
            const price = parseFloat(item.price) || 0;
            html += `
                <div class="favorite-item" data-product-id="${item.productId}">
                    <div class="favorite-item-image">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/200x200?text=Product'">
                        <button class="favorite-remove" data-product-id="${item.productId}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="favorite-item-details">
                        <h4 class="favorite-item-title">${item.name}</h4>
                        <p class="favorite-item-price">$${price.toFixed(2)}</p>
                        <div class="favorite-item-actions">
                            <button class="btn-small add-to-cart-from-fav" data-product-id="${item.productId}">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                            <a href="product-details.html?id=${item.productId}" class="btn-small btn-secondary">View Details</a>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        favoritesContainer.innerHTML = html;
        this.attachFavoritesEventListeners();
    }

    // ========== EVENT LISTENERS ==========

    attachCartItemEventListeners() {
        const cartItemsContainer = document.getElementById('cartItems');
        if (!cartItemsContainer) return;

        // Remove buttons
        cartItemsContainer.addEventListener('click', async (e) => {
            const removeBtn = e.target.closest('.cart-item-remove');
            const decreaseBtn = e.target.closest('.decrease');
            const increaseBtn = e.target.closest('.increase');
            
            if (removeBtn) {
                const productId = removeBtn.dataset.productId;
                const size = removeBtn.dataset.size || null;
                await this.removeFromCart(productId, size);
            } else if (decreaseBtn) {
                const productId = decreaseBtn.dataset.productId;
                const size = decreaseBtn.dataset.size || null;
                const item = this.cartItems.find(item => 
                    item.productId == productId && item.selectedSize === size
                );
                if (item && item.quantity > 1) {
                    await this.updateCartItemQuantity(productId, item.quantity - 1, size);
                } else if (item) {
                    await this.removeFromCart(productId, size);
                }
            } else if (increaseBtn) {
                const productId = increaseBtn.dataset.productId;
                const size = increaseBtn.dataset.size || null;
                const item = this.cartItems.find(item => 
                    item.productId == productId && item.selectedSize === size
                );
                if (item) {
                    await this.updateCartItemQuantity(productId, item.quantity + 1, size);
                }
            }
        });

        // Quantity input change
        cartItemsContainer.addEventListener('change', async (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const input = e.target;
                const productId = input.dataset.productId;
                const size = input.dataset.size || null;
                const quantity = parseInt(input.value) || 1;
                
                await this.updateCartItemQuantity(productId, quantity, size);
            }
        });
    }

    attachFavoritesEventListeners() {
        const favoritesContainer = document.getElementById('favoritesList');
        if (!favoritesContainer) return;

        favoritesContainer.addEventListener('click', async (e) => {
            // Remove from favorites
            if (e.target.closest('.favorite-remove')) {
                const button = e.target.closest('.favorite-remove');
                const productId = button.dataset.productId;
                
                await this.removeFromFavorites(productId);
            }
            
            // Add to cart from favorites
            else if (e.target.closest('.add-to-cart-from-fav')) {
                const button = e.target.closest('.add-to-cart-from-fav');
                const productId = button.dataset.productId;
                const item = this.favoriteItems.find(item => item.productId == productId);
                
                if (item && item.productData) {
                    await this.addToCart(item.productData, 1);
                }
            }
        });
    }
}

// Initialize the system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cartFavoritesSystem = new CartFavoritesSystem();
    
    // Also expose for immediate use if needed
    if (!window.cartFavoritesSystem) {
        window.cartFavoritesSystem = new CartFavoritesSystem();
    }
});

// Make sure it's available globally
if (!window.cartFavoritesSystem) {
    window.cartFavoritesSystem = new CartFavoritesSystem();
}