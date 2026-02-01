// cart-favorites.js - Complete cart and favorites system with Firestore sync

class CartFavoritesSystem {
    constructor() {
        this.currentUser = null;
        this.cartItems = [];
        this.favoriteItems = [];
        this.init();
    }

    async init() {
        // Listen for auth state changes
        auth.onAuthStateChanged(async (user) => {
            this.currentUser = user;
            if (user) {
                // User is logged in - load their data from Firestore
                await this.loadUserData();
                this.updateCartUI();
                this.updateFavoritesUI();
            } else {
                // User is logged out - clear data
                this.cartItems = [];
                this.favoriteItems = [];
                this.updateCartUI();
                this.updateFavoritesUI();
            }
        });
    }

    // ========== CART FUNCTIONS ==========

    async addToCart(product, quantity = 1, selectedSize = null) {
        try {
            if (!this.currentUser) {
                // Show login modal if not logged in
                showNotification('Please login to add items to cart', 'warning');
                // Open login modal
                if (window.authUI && window.authUI.showAuthModal) {
                    window.authUI.showAuthModal('login');
                }
                return false;
            }

            const cartItem = {
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                selectedSize: selectedSize,
                image: product.images?.[0] || '',
                addedAt: new Date().toISOString(),
                productData: product // Store complete product data for display
            };

            // Check if product already in cart
            const existingIndex = this.cartItems.findIndex(
                item => item.productId === product.id && item.selectedSize === selectedSize
            );

            if (existingIndex > -1) {
                // Update quantity if already exists
                this.cartItems[existingIndex].quantity += quantity;
            } else {
                // Add new item
                this.cartItems.push(cartItem);
            }

            // Save to Firestore
            await this.saveCartToFirestore();
            
            // Update UI
            this.updateCartUI();
            
            // Show notification
            showNotification(`${quantity} × ${product.name} added to cart`, 'success');
            
            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);
            showNotification('Error adding to cart', 'error');
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
                showNotification(`${removedItem.name} removed from cart`, 'info');
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error removing from cart:', error);
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
            showNotification('Cart cleared', 'info');
            
            return true;
        } catch (error) {
            console.error('Error clearing cart:', error);
            return false;
        }
    }

    async saveCartToFirestore() {
        if (!this.currentUser) return;

        try {
            await db.collection('carts').doc(this.currentUser.uid).set({
                userId: this.currentUser.uid,
                items: this.cartItems,
                updatedAt: new Date().toISOString(),
                itemCount: this.cartItems.length,
                totalAmount: this.getCartTotal()
            }, { merge: true });
        } catch (error) {
            console.error('Error saving cart to Firestore:', error);
            throw error;
        }
    }

    async loadCartFromFirestore() {
        if (!this.currentUser) return;

        try {
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
                showNotification('Please login to save favorites', 'warning');
                if (window.authUI && window.authUI.showAuthModal) {
                    window.authUI.showAuthModal('login');
                }
                return false;
            }

            const isFavorite = this.isProductFavorite(product.id);
            
            if (isFavorite) {
                await this.removeFromFavorites(product.id);
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
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || '',
                addedAt: new Date().toISOString(),
                productData: product
            };

            // Check if already in favorites
            if (!this.isProductFavorite(product.id)) {
                this.favoriteItems.push(favoriteItem);
                
                // Save to Firestore
                await this.saveFavoritesToFirestore();
                
                // Update UI
                this.updateFavoritesUI();
                
                // Show notification
                showNotification(`${product.name} added to favorites`, 'success');
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error adding to favorites:', error);
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
                showNotification(`${removedItem.name} removed from favorites`, 'info');
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error removing from favorites:', error);
            return false;
        }
    }

    async saveFavoritesToFirestore() {
        if (!this.currentUser) return;

        try {
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
        if (!this.currentUser) return;

        try {
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
        return this.favoriteItems.some(item => item.productId === productId);
    }

    getCartItemCount() {
        return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    }

    getCartTotal() {
        return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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

    // ========== UI UPDATES ==========

    updateCartUI() {
        // Update cart count in header
        const cartCount = this.getCartItemCount();
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            element.textContent = cartCount;
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
        const favoriteButtons = document.querySelectorAll('.product-favorite');
        
        favoriteButtons.forEach(button => {
            const productCard = button.closest('.product-card');
            if (productCard) {
                const productId = parseInt(productCard.dataset.id);
                const isFavorite = this.isProductFavorite(productId);
                
                const icon = button.querySelector('i');
                if (icon) {
                    if (isFavorite) {
                        icon.classList.add('active');
                        icon.style.color = 'var(--color-secondary)';
                    } else {
                        icon.classList.remove('active');
                        icon.style.color = '';
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
            html += `
                <div class="cart-item" data-product-id="${item.productId}" data-size="${item.selectedSize || ''}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        ${item.selectedSize ? `<p class="cart-item-size">Size: ${item.selectedSize}</p>` : ''}
                        <p class="cart-item-price">$${item.price.toFixed(2)} each</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-action="decrease" data-index="${index}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" data-index="${index}">
                        <button class="quantity-btn increase" data-action="increase" data-index="${index}">+</button>
                    </div>
                    <div class="cart-item-total">
                        $${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button class="cart-item-remove" data-action="remove" data-index="${index}">
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
            html += `
                <div class="favorite-item" data-product-id="${item.productId}">
                    <div class="favorite-item-image">
                        <img src="${item.image}" alt="${item.name}">
                        <button class="favorite-remove" data-index="${index}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="favorite-item-details">
                        <h4 class="favorite-item-title">${item.name}</h4>
                        <p class="favorite-item-price">$${item.price.toFixed(2)}</p>
                        <div class="favorite-item-actions">
                            <button class="btn-small add-to-cart-from-fav" data-index="${index}">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                            <a href="#" class="btn-small btn-secondary">View Details</a>
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
            if (e.target.closest('.cart-item-remove')) {
                const button = e.target.closest('.cart-item-remove');
                const index = parseInt(button.dataset.index);
                const item = this.cartItems[index];
                
                if (item) {
                    await this.removeFromCart(item.productId, item.selectedSize);
                }
            }
            
            // Quantity decrease
            else if (e.target.closest('.decrease')) {
                const button = e.target.closest('.decrease');
                const index = parseInt(button.dataset.index);
                const item = this.cartItems[index];
                
                if (item && item.quantity > 1) {
                    await this.updateCartItemQuantity(item.productId, item.quantity - 1, item.selectedSize);
                }
            }
            
            // Quantity increase
            else if (e.target.closest('.increase')) {
                const button = e.target.closest('.increase');
                const index = parseInt(button.dataset.index);
                const item = this.cartItems[index];
                
                if (item) {
                    await this.updateCartItemQuantity(item.productId, item.quantity + 1, item.selectedSize);
                }
            }
        });

        // Quantity input change
        cartItemsContainer.addEventListener('change', async (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const input = e.target;
                const index = parseInt(input.dataset.index);
                const item = this.cartItems[index];
                const quantity = parseInt(input.value);
                
                if (item && quantity > 0) {
                    await this.updateCartItemQuantity(item.productId, quantity, item.selectedSize);
                }
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
                const index = parseInt(button.dataset.index);
                const item = this.favoriteItems[index];
                
                if (item) {
                    await this.removeFromFavorites(item.productId);
                }
            }
            
            // Add to cart from favorites
            else if (e.target.closest('.add-to-cart-from-fav')) {
                const button = e.target.closest('.add-to-cart-from-fav');
                const index = parseInt(button.dataset.index);
                const item = this.favoriteItems[index];
                
                if (item && item.productData) {
                    await this.addToCart(item.productData, 1);
                }
            }
        });
    }
}

// Initialize the system
const cartFavoritesSystem = new CartFavoritesSystem();

// Expose to window for easy access
window.cartFavoritesSystem = cartFavoritesSystem;