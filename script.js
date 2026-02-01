/* 
 * IntimaWell - Sexual Wellness Website
 * Main JavaScript File
 * 
 * Table of Contents:
 * 1. DOM Ready & Initialization
 * 2. Mobile Navigation
 * 3. Age Verification Modal
 * 4. Mock Data & API Simulation
 * 5. Dynamic Content Loading
 * 6. Form Handling
 * 7. Shop Functionality
 * 8. Partners Modal
 * 9. Utility Functions
 */

// ============================================
// 1. DOM READY & INITIALIZATION
// ============================================

/**
 * Initialize the application when DOM is fully loaded
 * This function coordinates all other initialization functions
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('IntimaWell website initialized');
    
    // Initialize mobile navigation
    initMobileNavigation();
    
    // Initialize age verification
    initAgeVerification();
    
    // Load dynamic content based on current page
    loadPageContent();
    
    // Initialize forms
    initForms();
    
    // Initialize shop functionality if on shop page
    if (document.querySelector('.shop-products')) {
        initShop();
    }
    
    // Initialize partners modal if on partners page
    if (document.querySelector('.partners-grid-section')) {
        initPartnersModal();
    }
    
    // Initialize cart count on page load
    updateCartCount();
});


// ============================================
// THEME SYSTEM
// ============================================

/**
 * Initialize theme system
 */
function initThemeSystem() {
    // Get saved theme or default to luxurious
    const savedTheme = localStorage.getItem('intimawell-theme') || 'luxurious';
    
    // Apply saved theme
    applyTheme(savedTheme);
    
    // Initialize theme dropdown
    initThemeDropdown();
    
    // Initialize age verification theme selection
    initAgeVerificationTheme();
}

/**
 * Apply theme to website
 * @param {string} themeName - Theme to apply
 */
function applyTheme(themeName) {
    // Remove all theme classes
    document.body.classList.remove('theme-girly', 'theme-lgbt', 'theme-manly', 'theme-luxurious');
    
    // Add new theme class
    document.body.classList.add(`theme-${themeName}`);
    
    // Add transition class for smooth theme change
    document.body.classList.add('theme-transition');
    
    // Update active theme in dropdown
    updateActiveTheme(themeName);
    
    // Save to localStorage
    localStorage.setItem('intimawell-theme', themeName);
    
    // Remove transition class after animation
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 500);
    
    // Show notification
    showThemeNotification(themeName);
}


document.addEventListener('DOMContentLoaded', function() {
    // ... existing initialization ...
    
    // Initialize cart and favorites system
    if (typeof CartFavoritesSystem !== 'undefined') {
        // Already initialized in cart-favorites.js
        console.log('Cart & Favorites system initialized');
    }
    
    // ... rest of your initialization ...
});


/**
 * Initialize theme dropdown functionality
 */
function initThemeDropdown() {
    const themeToggle = document.getElementById('themeToggle');
    const themeOptions = document.getElementById('themeOptions');
    const themeOptionButtons = document.querySelectorAll('.theme-option');
    
    if (!themeToggle || !themeOptions) return;
    
    // Show/hide dropdown on hover
    themeToggle.addEventListener('mouseenter', function() {
        themeOptions.style.opacity = '1';
        themeOptions.style.visibility = 'visible';
        themeOptions.style.transform = 'translateY(0)';
    });
    
    themeToggle.addEventListener('mouseleave', function() {
        setTimeout(() => {
            if (!themeOptions.matches(':hover')) {
                themeOptions.style.opacity = '0';
                themeOptions.style.visibility = 'hidden';
                themeOptions.style.transform = 'translateY(-10px)';
            }
        }, 100);
    });
    
    themeOptions.addEventListener('mouseleave', function() {
        this.style.opacity = '0';
        this.style.visibility = 'hidden';
        this.style.transform = 'translateY(-10px)';
    });
    
    // Theme selection
    themeOptionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const themeName = this.dataset.theme;
            applyTheme(themeName);
            
            // Close dropdown
            themeOptions.style.opacity = '0';
            themeOptions.style.visibility = 'hidden';
            themeOptions.style.transform = 'translateY(-10px)';
        });
    });
}

/**
 * Update active theme in dropdown
 * @param {string} themeName - Active theme name
 */
function updateActiveTheme(themeName) {
    const themeOptionButtons = document.querySelectorAll('.theme-option');
    
    themeOptionButtons.forEach(button => {
        if (button.dataset.theme === themeName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

/**
 * Initialize age verification theme selection
 */
function initAgeVerificationTheme() {
    const ageThemeOptions = document.getElementById('ageThemeOptions');
    
    if (!ageThemeOptions) return;
    
    const themeOptions = ageThemeOptions.querySelectorAll('.age-theme-option');
    
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            themeOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Get selected theme
            const themeName = this.dataset.theme;
            
            // Apply theme preview (just for the modal)
            previewThemeInModal(themeName);
        });
    });
}

/**
 * Preview theme in age verification modal
 * @param {string} themeName - Theme to preview
 */
function previewThemeInModal(themeName) {
    const modal = document.getElementById('ageVerification');
    if (!modal) return;
    
    // Store the original theme
    const originalTheme = document.body.className.match(/theme-\w+/)?.[0] || 'theme-luxurious';
    
    // Remove all theme classes from modal
    modal.classList.remove('theme-girly', 'theme-lgbt', 'theme-manly', 'theme-luxurious');
    
    // Add preview theme class to modal only
    modal.classList.add(`theme-${themeName}`);
    
    // Store preview theme
    modal.dataset.previewTheme = themeName;
}

/**
 * Apply theme from age verification modal
 */
function applyThemeFromAgeVerification() {
    const modal = document.getElementById('ageVerification');
    if (!modal) return;
    
    const selectedTheme = modal.querySelector('.age-theme-option.selected');
    if (selectedTheme) {
        const themeName = selectedTheme.dataset.theme;
        applyTheme(themeName);
    }
}

/**
 * Show theme change notification
 * @param {string} themeName - Theme name
 */
function showThemeNotification(themeName) {
    const themeNames = {
        'girly': 'Girly Theme',
        'lgbt': 'LGBT+Q Theme',
        'manly': 'Manly Theme',
        'luxurious': 'Luxurious Theme'
    };
    
    const themeColors = {
        'girly': '#ff6b9d',
        'lgbt': '#ff8c00',
        'manly': '#3498db',
        'luxurious': '#8a4fff'
    };
    
    const displayName = themeNames[themeName] || 'Custom Theme';
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'theme-notification';
    notification.innerHTML = `
        <div class="theme-notification-icon">
            <i class="fas fa-palette"></i>
        </div>
        <div class="theme-notification-content">
            <h4>Theme Updated</h4>
            <p>Switched to <strong>${displayName}</strong></p>
        </div>
    `;
    
    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${themeColors[themeName]}15;
        border: 1px solid ${themeColors[themeName]}30;
        color: ${themeColors[themeName]};
        padding: var(--space-md);
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        gap: var(--space-md);
        z-index: 10000;
        box-shadow: var(--shadow-lg);
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        max-width: 300px;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}



document.addEventListener('DOMContentLoaded', function() {
    console.log('IntimaWell website initialized');
    
    // Initialize mobile navigation
    initMobileNavigation();
    
    // Initialize theme system
    initThemeSystem();
    
    // Initialize age verification
    initAgeVerification();
    
    // Load dynamic content based on current page
    loadPageContent();
    
    // Initialize forms
    initForms();
    
    // Initialize shop functionality if on shop page
    if (document.querySelector('.shop-products')) {
        initShop();
    }
    
    // Initialize partners modal if on partners page
    if (document.querySelector('.partners-grid-section')) {
        initPartnersModal();
    }
    
    // Initialize cart count on page load
    updateCartCount();
});


// ============================================
// 2. MOBILE NAVIGATION
// ============================================

/**
 * Initialize mobile navigation toggle functionality
 * This handles opening/closing the mobile menu
 */
function initMobileNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileNav = document.getElementById('mobileNav');
    
    if (!mobileMenuToggle || !mobileNav) return;
    
    // Open mobile menu
    mobileMenuToggle.addEventListener('click', function() {
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    // Close mobile menu
    mobileMenuClose.addEventListener('click', function() {
        mobileNav.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });
    
    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-list a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    mobileNav.addEventListener('click', function(e) {
        if (e.target === mobileNav) {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// 3. AGE VERIFICATION MODAL
// ============================================

function initAgeVerification() {
    const ageVerificationModal = document.getElementById('ageVerification');
    const confirmAgeBtn = document.getElementById('confirmAge');
    const exitSiteBtn = document.getElementById('exitSite');
    
    // Check if age has already been verified
    const ageVerified = localStorage.getItem('ageVerified');
    
    if (!ageVerified) {
        // Show age verification modal
        if (ageVerificationModal) {
            ageVerificationModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }
    
    // Handle age confirmation
    if (confirmAgeBtn) {
        confirmAgeBtn.addEventListener('click', function() {
            // Apply theme from modal selection
            applyThemeFromAgeVerification();
            
            // Set age verification
            localStorage.setItem('ageVerified', 'true');
            
            if (ageVerificationModal) {
                ageVerificationModal.classList.add('hidden');
                document.body.style.overflow = ''; // Restore scrolling
            }
            
            // Show welcome message
            const theme = localStorage.getItem('intimawell-theme') || 'luxurious';
            const themeNames = {
                'girly': 'Girly',
                'lgbt': 'LGBT+Q',
                'manly': 'Manly',
                'luxurious': 'Luxurious'
            };
            
            showNotification(`Welcome! Enjoy your ${themeNames[theme]} themed experience.`, 'success');
        });
    }
    
    // Handle exit site
    if (exitSiteBtn) {
        exitSiteBtn.addEventListener('click', function() {
            // Redirect to a safe website
            window.location.href = 'https://www.commonsensemedia.org/';
        });
    }
}

// ============================================
// 4. MOCK DATA & API SIMULATION
// ============================================

/**
 * Mock data for products with enhanced features
 * In a real application, this would come from a backend API
 */
const mockProducts = [
    {
        id: 1,
        name: "Premium Vibrator",
        description: "High-quality, body-safe materials designed for comfort and enhanced intimate wellness.",
        tooltip: "Waterproof, rechargeable, with multiple vibration patterns. Made from medical-grade silicone.",
        price: 89.99,
        category: "premium",
        badge: "Bestseller",
        images: [
            "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w-400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w-400&h=400&fit=crop"
        ],
        sizes: [
            { name: "S", stock: 5, default: true },
            { name: "M", stock: 8 },
            { name: "L", stock: 3 },
            { name: "XL", stock: 0 }
        ],
        reviews: [
            { author: "Alex M.", text: "Excellent product, very comfortable and discreet." },
            { author: "Jordan T.", text: "Great quality, exceeded my expectations!" }
        ]
    },
    {
        id: 2,
        name: "Couples Massage Set",
        description: "Designed for shared experiences and connection. Includes multiple attachments.",
        tooltip: "Includes 2 massage wands, lubricant, and storage case. Perfect for couples.",
        price: 149.99,
        category: "couples",
        badge: "New",
        images: [
            "https://images.unsplash.com/photo-1576086213369-97a306d36557?w-400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w-400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w-400&h=400&fit=crop"
        ],
        sizes: [
            { name: "Standard", stock: 12, default: true },
            { name: "Deluxe", stock: 4 }
        ],
        reviews: [
            { author: "Sam R.", text: "Enhanced our intimacy significantly!" }
        ]
    },
    {
        id: 3,
        name: "Discreet Personal Massager",
        description: "Compact and quiet design for personal wellness with complete privacy.",
        tooltip: "Whisper-quiet operation, USB rechargeable, travel-friendly size.",
        price: 59.99,
        category: "wellness",
        images: [
            "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w-400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1576086213369-97a306d36557?w-400&h=400&fit=crop"
        ],
        sizes: [
            { name: "One Size", stock: 15, default: true }
        ],
        reviews: []
    },
    {
        id: 4,
        name: "Advanced Stimulator",
        description: "Feature-rich with multiple settings and patterns for customizable experiences.",
        tooltip: "10 vibration patterns, 5 intensity levels, waterproof design.",
        price: 129.99,
        category: "premium",
        badge: "Premium",
        images: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w-400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w-400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w-400&h=400&fit=crop"
        ],
        sizes: [
            { name: "S", stock: 7, default: true },
            { name: "M", stock: 4 },
            { name: "L", stock: 2 }
        ],
        reviews: [
            { author: "Taylor J.", text: "Worth every penny! The patterns are amazing." },
            { author: "Morgan K.", text: "Very powerful yet quiet." },
            { author: "Casey L.", text: "Great battery life and easy to clean." }
        ]
    },
    {
        id: 5,
        name: "Wellness Starter Kit",
        description: "Perfect for beginners. Includes educational guide and premium lubricant.",
        tooltip: "Includes: Massager, lubricant, cleaning spray, and detailed guide.",
        price: 79.99,
        category: "wellness",
        images: [
            "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w-400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1576086213369-97a306d36557?w-400&h=400&fit=crop"
        ],
        sizes: [
            { name: "Kit", stock: 20, default: true }
        ],
        reviews: [
            { author: "Beginner User", text: "Perfect introduction, everything I needed." }
        ]
    },
    {
        id: 6,
        name: "Safety & Protection Package",
        description: "Essential protection products for safe intimate experiences.",
        tooltip: "Includes various protection items and educational materials.",
        price: 39.99,
        category: "safety",
        badge: "Essential",
        images: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w-400&h=400&fit=crop"
        ],
        sizes: [
            { name: "Small Pack", stock: 25, default: true },
            { name: "Large Pack", stock: 10 }
        ],
        reviews: []
    },
    {
        id: 7,
        name: "Luxury Edition Massager",
        description: "Premium design with ergonomic shape and whisper-quiet operation.",
        tooltip: "Gold-plated accents, leather storage case, 2-year warranty.",
        price: 199.99,
        category: "premium",
        badge: "Luxury",
        images: [
            "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w-400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w-400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w-400&h=400&fit=crop"
        ],
        sizes: [
            { name: "Standard", stock: 3, default: true },
            { name: "Limited", stock: 1 }
        ],
        reviews: [
            { author: "VIP Customer", text: "Absolutely luxurious! The quality is exceptional." }
        ]
    },
    {
        id: 8,
        name: "Connect Couples Device",
        description: "Designed to enhance connection and intimacy for all relationship dynamics.",
        tooltip: "App-controlled, long-distance capable, syncs with music.",
        price: 169.99,
        category: "couples",
        badge: "Smart",
        images: [
            "https://images.unsplash.com/photo-1576086213369-97a306d36557?w-400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w-400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w-400&h=400&fit=crop"
        ],
        sizes: [
            { name: "Set of 2", stock: 6, default: true }
        ],
        reviews: [
            { author: "Long-distance Couple", text: "Game-changer for our relationship!" },
            { author: "Tech Enthusiast", text: "The app integration is seamless." }
        ]
    }
];



// ============================================
// INTEGRATE CART & FAVORITES WITH PRODUCT CARDS
// ============================================

/**
 * Update the product card creation to work with cart/favorites system
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.dataset.category = product.category;
    card.dataset.price = product.price < 50 ? 'low' : (product.price < 150 ? 'medium' : 'high');
    
    // Check if product is in favorites
    const isFavorite = window.cartFavoritesSystem 
        ? window.cartFavoritesSystem.isProductFavorite(product.id) 
        : false;
    
    // Create sizes HTML
    let sizesHtml = '';
    if (product.sizes && product.sizes.length > 0) {
        sizesHtml = `
            <div class="product-sizes">
                <span class="size-label">Size:</span>
                <div class="size-options">
                    ${product.sizes.map(size => `
                        <div class="size-option ${size.stock <= 0 ? 'out-of-stock' : ''} ${size.default ? 'selected' : ''}" 
                             data-size="${size.name}" 
                             data-stock="${size.stock}">
                            ${size.name}
                            ${size.stock > 0 ? `<span class="stock-count">${size.stock} left</span>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // ... rest of your existing product card HTML ...
    // Keep your existing HTML but update the favorite button:
    
    const favoriteIcon = isFavorite ? 'fas fa-heart active' : 'fas fa-heart';
    
    card.innerHTML = `
        <!-- Product Badge -->
        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        
        <!-- Product Image Gallery -->
        <div class="product-image-gallery">
            <img src="${product.images[0]}" alt="${product.name}" class="product-main-image">
            
            <!-- Image Thumbnails -->
            <div class="product-thumbnails">
                ${product.images.map((img, index) => `
                    <div class="product-thumbnail ${index === 0 ? 'active' : ''}" data-image-index="${index}">
                        <img src="${img}" alt="Thumbnail ${index + 1}">
                    </div>
                `).join('')}
            </div>
            
            <!-- Product Actions (Heart, etc.) -->
            <div class="product-actions">
                <button class="product-favorite ${isFavorite ? 'active' : ''}" aria-label="Add to favorites" data-action="toggle-favorite">
                    <i class="${favoriteIcon}" style="${isFavorite ? 'color: var(--color-secondary);' : ''}"></i>
                </button>
            </div>
        </div>
        
        <!-- ... rest of your existing product card HTML ... -->
        <!-- Make sure to include all your existing HTML from the createProductCard function -->
        
        <!-- Product Actions Footer - UPDATE THIS SECTION -->
        <div class="product-actions-footer">
            <a href="#" class="btn-small" data-action="add-to-cart">Add to Cart</a>
            <a href="#" class="btn-small btn-secondary" data-action="view-details">View Details</a>
        </div>
    `;
    
    // Initialize product card with new handlers
    initializeProductCard(card, product);
    
    return card;
}

/**
 * Update the initializeProductCard function to use new system
 */
function initializeProductCard(card, product) {
    // ... keep your existing initialization code ...
    
    // Add to cart functionality - UPDATE THIS
    const addToCartBtn = card.querySelector('[data-action="add-to-cart"]');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const quantity = parseInt(card.querySelector('.quantity-input').value);
            const selectedSize = product.selectedSize || (product.sizes && product.sizes[0]?.name);
            
            // Check if size is selected
            if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                showNotification('Please select a size first', 'warning');
                return;
            }
            
            // Use the new cart system
            if (window.cartFavoritesSystem) {
                await window.cartFavoritesSystem.addToCart(product, quantity, selectedSize);
            } else {
                // Fallback to old system
                addToCart({
                    ...product,
                    quantity: quantity,
                    selectedSize: selectedSize
                });
            }
        });
    }
    
    // Favorite button functionality - UPDATE THIS
    const favoriteBtn = card.querySelector('[data-action="toggle-favorite"]');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (window.cartFavoritesSystem) {
                const isNowFavorite = await window.cartFavoritesSystem.toggleFavorite(product);
                
                if (isNowFavorite) {
                    this.classList.add('active');
                    const icon = this.querySelector('i');
                    icon.classList.add('active');
                    icon.style.color = 'var(--color-secondary)';
                    showNotification(`Added ${product.name} to favorites`, 'success');
                } else {
                    this.classList.remove('active');
                    const icon = this.querySelector('i');
                    icon.classList.remove('active');
                    icon.style.color = '';
                    showNotification(`Removed ${product.name} from favorites`, 'info');
                }
            } else {
                // Fallback to old system
                const isFavorite = this.classList.toggle('active');
                const icon = this.querySelector('i');
                
                if (isFavorite) {
                    icon.style.color = 'var(--color-secondary)';
                    addToFavorites(product);
                    showFavoriteNotification(`Added ${product.name} to favorites`);
                } else {
                    icon.style.color = '';
                    removeFromFavorites(product.id);
                    showFavoriteNotification(`Removed ${product.name} from favorites`);
                }
            }
        });
    }
    
    // ... rest of your existing initialization code ...
}


/**
 * Mock data for educational articles
 */
const mockArticles = [
    {
        id: 1,
        title: "Understanding [ORIENTATION_AWARENESS]",
        excerpt: "A comprehensive guide to sexual orientations and gender identities for inclusive understanding.",
        category: "[ORIENTATION_AWARENESS]",
        author: "Dr. Alex Morgan",
        date: "2023-10-15",
        imageColor: "#8a4fff"
    },
    {
        id: 2,
        title: "Safe Practices for [INTIMATE_WELLNESS]",
        excerpt: "Essential safety guidelines for using [ADULT_PRODUCT] and maintaining sexual health.",
        category: "Safety & Protection",
        author: "Jordan Taylor",
        date: "2023-10-10",
        imageColor: "#ff6b8b"
    },
    {
        id: 3,
        title: "Communication in Intimate Relationships",
        excerpt: "How to build healthy communication patterns for all relationship structures.",
        category: "Relationships & Communication",
        author: "Dr. Samira Chen",
        date: "2023-10-05",
        imageColor: "#00d4aa"
    },
    {
        id: 4,
        title: "Choosing the Right [ADULT_PRODUCT]",
        excerpt: "A guide to selecting products based on personal preferences and needs.",
        category: "Product Education",
        author: "IntimaWell Team",
        date: "2023-09-28",
        imageColor: "#6b3fcc"
    },
    {
        id: 5,
        title: "[INTIMATE_WELLNESS] for Couples",
        excerpt: "Enhancing connection and intimacy through shared experiences and communication.",
        category: "Relationships & Communication",
        author: "Dr. Marcus Lee",
        date: "2023-09-20",
        imageColor: "#a87bff"
    },
    {
        id: 6,
        title: "Sexual Health Check-ups: What to Expect",
        excerpt: "Demystifying sexual health examinations and regular check-ups.",
        category: "Sexual Health",
        author: "Dr. Alex Morgan",
        date: "2023-09-15",
        imageColor: "#4a4558"
    }
];

/**
 * Mock data for partners/specialists
 */
const mockPartners = [
    {
        id: 1,
        name: "Dr. Alex Morgan",
        title: "Sexual Health Specialist",
        bio: "10+ years experience in [ORIENTATION_AWARENESS] and wellness counseling. Specializes in LGBTQ+ health and relationship therapy.",
        specialties: ["Sexual Medicine", "LGBTQ+ Health", "Relationship Counseling"],
        credentials: ["MD, Sexual Medicine", "Certified Sex Therapist", "PhD in Clinical Psychology"],
        services: "Available for online consultations and educational workshops.",
        imageColor: "#8a4fff"
    },
    {
        id: 2,
        name: "Dr. Samira Chen",
        title: "Sex Therapist & Educator",
        bio: "Focuses on trauma-informed care, communication skills, and inclusive sex education for all orientations.",
        specialties: ["Sex Therapy", "Trauma-Informed Care", "Sex Education"],
        credentials: ["Licensed Clinical Social Worker", "Certified Sex Therapist", "MA in Gender Studies"],
        services: "Individual and couples therapy, educational seminars.",
        imageColor: "#ff6b8b"
    },
    {
        id: 3,
        name: "Dr. Marcus Lee",
        title: "Relationship Counselor",
        bio: "Specializes in non-monogamous relationships, communication dynamics, and sexual exploration for couples.",
        specialties: ["Relationship Counseling", "Non-Monogamy", "Communication Dynamics"],
        credentials: ["PhD in Relationship Psychology", "Certified Relationship Coach", "MA in Counseling"],
        services: "Couples counseling, relationship workshops, communication coaching.",
        imageColor: "#00d4aa"
    },
    {
        id: 4,
        name: "Taylor Jordan",
        title: "Sexual Wellness Educator",
        bio: "Focuses on accessible, inclusive sexual education with emphasis on consent, safety, and pleasure.",
        specialties: ["Sex Education", "Consent Education", "Inclusive Curriculum Design"],
        credentials: ["MA in Public Health", "Certified Sex Educator", "BA in Gender Studies"],
        services: "Educational workshops, curriculum development, public speaking.",
        imageColor: "#6b3fcc"
    }
];

// ============================================
// 5. DYNAMIC CONTENT LOADING
// ============================================

/**
 * Load content specific to the current page
 * Determines which page is active and loads appropriate content
 */
function loadPageContent() {
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            loadFeaturedProducts();
            loadFeaturedPartners();
            break;
        case 'shop':
            loadAllProducts();
            break;
        case 'education':
            loadArticles();
            break;
        case 'partners':
            loadAllPartners();
            break;
        // About and Contact pages don't need dynamic content loading
    }
}

/**
 * Determine the current page based on URL or body classes
 * @returns {string} The current page identifier
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    
    if (filename === '' || filename === 'index.html' || filename === 'index') {
        return 'index';
    } else if (filename.includes('shop')) {
        return 'shop';
    } else if (filename.includes('education')) {
        return 'education';
    } else if (filename.includes('partners')) {
        return 'partners';
    } else if (filename.includes('about')) {
        return 'about';
    } else if (filename.includes('contact')) {
        return 'contact';
    }
    
    return 'index'; // Default to index
}

/**
 * Load featured products on the home page
 */
function loadFeaturedProducts() {
    const productsGrid = document.getElementById('featuredProducts');
    if (!productsGrid) return;
    
    // Clear loading placeholder
    productsGrid.innerHTML = '';
    
    // Get only featured products (first 4)
    const featuredProducts = mockProducts.slice(0, 4);
    
    // Create product cards
    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

/**
 * Load all products on the shop page
 */
function loadAllProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const productCount = document.getElementById('productCount');
    
    if (!productsGrid) return;
    
    // Clear loading placeholder
    productsGrid.innerHTML = '';
    
    // Create product cards for all products
    mockProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    // Update product count
    if (productCount) {
        productCount.textContent = `${mockProducts.length} products available`;
    }
}

/**
 * Create an enhanced product card HTML element
 * @param {Object} product - Product data object
 * @returns {HTMLElement} Enhanced product card element
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.dataset.category = product.category;
    card.dataset.price = product.price < 50 ? 'low' : (product.price < 150 ? 'medium' : 'high');
    
    // Generate unique ID for tooltip
    const tooltipId = `tooltip-${product.id}`;
    
    // Create sizes HTML
    let sizesHtml = '';
    if (product.sizes && product.sizes.length > 0) {
        sizesHtml = `
            <div class="product-sizes">
                <span class="size-label">Size:</span>
                <div class="size-options">
                    ${product.sizes.map(size => `
                        <div class="size-option ${size.stock <= 0 ? 'out-of-stock' : ''} ${size.default ? 'selected' : ''}" 
                             data-size="${size.name}" 
                             data-stock="${size.stock}">
                            ${size.name}
                            ${size.stock > 0 ? `<span class="stock-count">${size.stock} left</span>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Create reviews HTML
    let reviewsHtml = '';
    if (product.reviews && product.reviews.length > 0) {
        const recentReviews = product.reviews.slice(0, 2);
        reviewsHtml = `
            <div class="product-reviews-preview">
                <div class="reviews-header">
                    <span class="reviews-title">Recent Reviews</span>
                    <span class="reviews-count">${product.reviews.length} reviews</span>
                </div>
                ${recentReviews.map(review => `
                    <div class="review-item">
                        <div class="review-author">${review.author}</div>
                        <div class="review-text">${review.text}</div>
                    </div>
                `).join('')}
                <a href="#" class="view-all-reviews" data-action="view-reviews">View All Reviews</a>
            </div>
        `;
    }
    
    card.innerHTML = `
        <!-- Product Badge -->
        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        
        <!-- Product Image Gallery -->
        <div class="product-image-gallery">
            <img src="${product.images[0]}" alt="${product.name}" class="product-main-image">
            
            <!-- Image Thumbnails -->
            <div class="product-thumbnails">
                ${product.images.map((img, index) => `
                    <div class="product-thumbnail ${index === 0 ? 'active' : ''}" data-image-index="${index}">
                        <img src="${img}" alt="Thumbnail ${index + 1}">
                    </div>
                `).join('')}
            </div>
            
            <!-- Product Actions (Heart, etc.) -->
            <div class="product-actions">
                <button class="product-favorite" aria-label="Add to favorites" data-action="toggle-favorite">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
        
        <!-- Product Info -->
        <div class="product-info">
            <!-- Product Header with Tooltip Icon -->
            <div class="product-header">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-info-tooltip">
                    <button class="product-info-icon" aria-label="Product information">
                        <i class="fas fa-info-circle"></i>
                    </button>
                    <div class="product-tooltip" id="${tooltipId}">
                        ${product.tooltip || product.description}
                    </div>
                </div>
            </div>
            
            <!-- Product Price -->
            <div class="product-price">$${product.price.toFixed(2)}</div>
            
            <!-- Product Description -->
            <p class="product-description">${product.description}</p>
            
            <!-- Product Sizes -->
            ${sizesHtml}
            
            <!-- Quantity Selector -->
            <div class="product-quantity">
                <span class="quantity-label">Quantity:</span>
                <div class="quantity-controls">
                    <button class="quantity-btn" data-action="decrease-quantity" aria-label="Decrease quantity">-</button>
                    <input type="number" class="quantity-input" value="1" min="1" max="10" aria-label="Quantity">
                    <button class="quantity-btn" data-action="increase-quantity" aria-label="Increase quantity">+</button>
                </div>
            </div>
            
            <!-- Product Reviews Preview -->
            ${reviewsHtml}
            
            <!-- Comment Form (Initially Hidden) -->
            <div class="product-comments">
                <div class="comment-form" id="comment-form-${product.id}">
                    <textarea class="comment-textarea" placeholder="Share your thoughts about this product..." rows="2"></textarea>
                    <button class="comment-submit-btn" data-action="submit-comment">Submit Review</button>
                </div>
                <div class="comment-login-prompt" id="login-prompt-${product.id}">
                    <a href="#" data-action="show-login">Log in</a> to leave a review
                </div>
            </div>
            
            <!-- Product Actions Footer -->
            <div class="product-actions-footer">
                <a href="#" class="btn-small" data-action="add-to-cart">Add to Cart</a>
                <a href="#" class="btn-small btn-secondary" data-action="view-details">View Details</a>
            </div>
        </div>
    `;
    
    // Initialize product card functionality
    initializeProductCard(card, product);
    
    return card;
}

/**
 * Initialize product card functionality
 * @param {HTMLElement} card - Product card element
 * @param {Object} product - Product data
 */
function initializeProductCard(card, product) {
    // Image gallery functionality
    const mainImage = card.querySelector('.product-main-image');
    const thumbnails = card.querySelectorAll('.product-thumbnail');
    const productImages = product.images;
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const index = parseInt(this.dataset.imageIndex);
            
            // Update main image
            mainImage.src = productImages[index];
            
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
        
        // Add hover preview
        thumb.addEventListener('mouseenter', function() {
            const index = parseInt(this.dataset.imageIndex);
            mainImage.style.opacity = '0.7';
            setTimeout(() => {
                mainImage.src = productImages[index];
                mainImage.style.opacity = '1';
            }, 150);
        });
    });
    
    // Favorite button functionality
    const favoriteBtn = card.querySelector('[data-action="toggle-favorite"]');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isFavorite = this.classList.toggle('active');
            const icon = this.querySelector('i');
            
            if (isFavorite) {
                icon.classList.remove('fa-heart');
                icon.classList.add('fas', 'fa-heart', 'active');
                addToFavorites(product);
                showFavoriteNotification(`Added ${product.name} to favorites`);
            } else {
                icon.classList.remove('active');
                removeFromFavorites(product.id);
                showFavoriteNotification(`Removed ${product.name} from favorites`);
            }
        });
    }
    
    // Size selection functionality
    const sizeOptions = card.querySelectorAll('.size-option:not(.out-of-stock)');
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all sizes
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked size
            this.classList.add('selected');
            
            // Update selected size in product data
            product.selectedSize = this.dataset.size;
            product.selectedStock = parseInt(this.dataset.stock);
            
            // Update max quantity based on stock
            const quantityInput = card.querySelector('.quantity-input');
            quantityInput.max = Math.min(10, product.selectedStock);
        });
    });
    
    // Quantity controls
    const decreaseBtn = card.querySelector('[data-action="decrease-quantity"]');
    const increaseBtn = card.querySelector('[data-action="increase-quantity"]');
    const quantityInput = card.querySelector('.quantity-input');
    
    if (decreaseBtn && increaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
                updateQuantityButtons(quantityInput);
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            const max = parseInt(quantityInput.max);
            if (value < max) {
                quantityInput.value = value + 1;
                updateQuantityButtons(quantityInput);
            }
        });
        
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            const min = parseInt(this.min);
            const max = parseInt(this.max);
            
            if (isNaN(value) || value < min) {
                this.value = min;
            } else if (value > max) {
                this.value = max;
            }
            
            updateQuantityButtons(this);
        });
        
        // Initialize quantity buttons
        updateQuantityButtons(quantityInput);
    }
    
    // Add to cart functionality
    const addToCartBtn = card.querySelector('[data-action="add-to-cart"]');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const quantity = parseInt(card.querySelector('.quantity-input').value);
            const selectedSize = product.selectedSize || (product.sizes && product.sizes[0]?.name);
            
            // Check if size is selected
            if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                showNotification('Please select a size first', 'warning');
                return;
            }
            
            // Add to cart with selected options
            addToCart({
                ...product,
                quantity: quantity,
                selectedSize: selectedSize
            });
        });
    }
    
    // View details functionality
    const viewDetailsBtn = card.querySelector('[data-action="view-details"]');
    if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // In Phase 2: Navigate to product detail page
            showNotification('Product detail page coming soon!', 'info');
        });
    }
    
    // Comment functionality
    setupCommentFunctionality(card, product);
    
    // View reviews functionality
    const viewReviewsBtn = card.querySelector('[data-action="view-reviews"]');
    if (viewReviewsBtn) {
        viewReviewsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // In Phase 2: Show all reviews modal
            showNotification('Reviews page coming soon!', 'info');
        });
    }
}

/**
 * Update quantity buttons state
 * @param {HTMLInputElement} input - Quantity input element
 */
function updateQuantityButtons(input) {
    const value = parseInt(input.value);
    const min = parseInt(input.min);
    const max = parseInt(input.max);
    
    const decreaseBtn = input.parentElement.querySelector('[data-action="decrease-quantity"]');
    const increaseBtn = input.parentElement.querySelector('[data-action="increase-quantity"]');
    
    if (decreaseBtn) {
        decreaseBtn.disabled = value <= min;
    }
    
    if (increaseBtn) {
        increaseBtn.disabled = value >= max;
    }
}

/**
 * Setup comment functionality for product card
 * @param {HTMLElement} card - Product card element
 * @param {Object} product - Product data
 */
function setupCommentFunctionality(card, product) {
    const commentForm = card.querySelector('.comment-form');
    const loginPrompt = card.querySelector('.comment-login-prompt');
    const commentTextarea = card.querySelector('.comment-textarea');
    const commentSubmitBtn = card.querySelector('[data-action="submit-comment"]');
    const showLoginLink = card.querySelector('[data-action="show-login"]');
    
    // Check if user is logged in (mock for Phase 1)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        // User is logged in - show comment form
        if (commentForm) commentForm.classList.add('active');
        if (loginPrompt) loginPrompt.style.display = 'none';
        
        // Handle comment submission
        if (commentSubmitBtn) {
            commentSubmitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const commentText = commentTextarea.value.trim();
                
                if (!commentText) {
                    showNotification('Please enter a comment', 'warning');
                    return;
                }
                
                if (commentText.length < 10) {
                    showNotification('Comment must be at least 10 characters', 'warning');
                    return;
                }
                
                // Submit comment (mock for Phase 1)
                const comment = {
                    productId: product.id,
                    text: commentText,
                    author: 'Current User',
                    date: new Date().toISOString()
                };
                
                // Simulate API call
                setTimeout(() => {
                    // In Phase 2, this would save to backend
                    showNotification('Thank you for your review!', 'success');
                    commentTextarea.value = '';
                    
                    // Add to local reviews (for demo)
                    if (!product.reviews) product.reviews = [];
                    product.reviews.unshift(comment);
                    
                    // Update reviews display
                    updateProductReviews(card, product);
                }, 500);
            });
        }
    } else {
        // User is not logged in - show login prompt
        if (commentForm) commentForm.classList.remove('active');
        if (loginPrompt) loginPrompt.style.display = 'block';
        
        // Login link handler
        if (showLoginLink) {
            showLoginLink.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('Login feature coming in Phase 2!', 'info');
                // In Phase 2: Show login modal
            });
        }
    }
}

/**
 * Update product reviews display
 * @param {HTMLElement} card - Product card element
 * @param {Object} product - Product data
 */
function updateProductReviews(card, product) {
    const reviewsContainer = card.querySelector('.product-reviews-preview');
    if (!reviewsContainer || !product.reviews) return;
    
    const recentReviews = product.reviews.slice(0, 2);
    const reviewsCount = card.querySelector('.reviews-count');
    
    if (reviewsCount) {
        reviewsCount.textContent = `${product.reviews.length} reviews`;
    }
    
    // Update review items
    const reviewItems = reviewsContainer.querySelectorAll('.review-item');
    reviewItems.forEach((item, index) => {
        if (recentReviews[index]) {
            const author = item.querySelector('.review-author');
            const text = item.querySelector('.review-text');
            
            if (author) author.textContent = recentReviews[index].author;
            if (text) text.textContent = recentReviews[index].text;
        }
    });
}

/**
 * Add product to favorites
 * @param {Object} product - Product to add to favorites
 */
function addToFavorites(product) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Check if product is already in favorites
    if (!favorites.find(item => item.id === product.id)) {
        favorites.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            addedAt: new Date().toISOString()
        });
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

/**
 * Remove product from favorites
 * @param {number} productId - Product ID to remove
 */
function removeFromFavorites(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(item => item.id !== productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

/**
 * Show favorite notification
 * @param {string} message - Notification message
 */
function showFavoriteNotification(message) {
    showNotification(message, 'success');
}

/**
 * Show general notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type: 'success', 'error', 'warning', 'info'
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    const typeColors = {
        success: '#00c853',
        error: '#ff5252',
        warning: '#ff9800',
        info: '#2196f3'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${typeColors[type]}15;
        color: ${typeColors[type]};
        padding: 12px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border: 1px solid ${typeColors[type]}30;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        max-width: 350px;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add CSS for animations if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove notification after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

/**
 * Load featured partners on the home page
 */
function loadFeaturedPartners() {
    const partnersGrid = document.getElementById('featuredPartners');
    if (!partnersGrid) return;
    
    // Clear loading placeholder
    partnersGrid.innerHTML = '';
    
    // Get only featured partners (first 3)
    const featuredPartners = mockPartners.slice(0, 3);
    
    // Create partner cards
    featuredPartners.forEach(partner => {
        const partnerCard = createPartnerCard(partner, false);
        partnersGrid.appendChild(partnerCard);
    });
}

/**
 * Load all partners on the partners page
 */
function loadAllPartners() {
    const partnersGrid = document.getElementById('partnersGrid');
    if (!partnersGrid) return;
    
    // Clear loading placeholder
    partnersGrid.innerHTML = '';
    
    // Create partner cards for all partners
    mockPartners.forEach(partner => {
        const partnerCard = createPartnerCard(partner, true);
        partnersGrid.appendChild(partnerCard);
    });
}

/**
 * Create a partner card HTML element
 * @param {Object} partner - Partner data object
 * @param {boolean} isDetailed - Whether to include detailed view button
 * @returns {HTMLElement} Partner card element
 */
function createPartnerCard(partner, isDetailed = false) {
    const card = document.createElement('div');
    card.className = 'partner-card';
    card.dataset.id = partner.id;
    
    card.innerHTML = `
        <div class="partner-image" style="background-color: ${partner.imageColor};">
            <div class="placeholder-image">
                <i class="fas fa-user-md"></i>
            </div>
        </div>
        <div class="partner-info">
            <h3 class="partner-name">${partner.name}</h3>
            <p class="partner-specialty">${partner.title}</p>
            <p class="partner-bio">${partner.bio}</p>
            ${isDetailed ? 
                `<button class="btn-small" data-action="view-partner">View Profile</button>` : 
                `<a href="partners.html" class="btn-small">View Profile</a>`
            }
        </div>
    `;
    
    // Add event listener to View Profile button if on partners page
    if (isDetailed) {
        const viewProfileBtn = card.querySelector('[data-action="view-partner"]');
        viewProfileBtn.addEventListener('click', function() {
            openPartnerModal(partner);
        });
    }
    
    return card;
}

/**
 * Load articles on the education page
 */
function loadArticles() {
    const articlesGrid = document.getElementById('articlesGrid');
    if (!articlesGrid) return;
    
    // Clear loading placeholder
    articlesGrid.innerHTML = '';
    
    // Create article cards
    mockArticles.forEach(article => {
        const articleCard = createArticleCard(article);
        articlesGrid.appendChild(articleCard);
    });
}

/**
 * Create an article card HTML element
 * @param {Object} article - Article data object
 * @returns {HTMLElement} Article card element
 */
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.dataset.id = article.id;
    
    // Format date for display
    const date = new Date(article.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    card.innerHTML = `
        <div class="article-image" style="background-color: ${article.imageColor};">
            <div class="placeholder-image">
                <i class="fas fa-book-open"></i>
            </div>
        </div>
        <div class="article-content">
            <span class="article-category">${article.category}</span>
            <h3 class="article-title">${article.title}</h3>
            <p class="article-excerpt">${article.excerpt}</p>
            <div class="article-meta">
                <span class="article-author">By ${article.author}</span>
                <span class="article-date">${formattedDate}</span>
            </div>
        </div>
    `;
    
    return card;
}

// ============================================
// 6. FORM HANDLING
// ============================================

/**
 * Initialize form functionality
 * Sets up form submission handlers
 */
function initForms() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
}

/**
 * Handle contact form submission
 * @param {Event} e - Form submit event
 */
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formMessage = document.getElementById('formMessage');
    
    // Basic form validation
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value;
    const message = form.message.value.trim();
    const consent = form.consent.checked;
    
    if (!name || !email || !subject || !message || !consent) {
        showFormMessage('Please fill in all required fields and confirm you are 18+.', 'error');
        return;
    }
    
    // Email validation - fixed regex (escaped dot)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // In a real implementation, this would send data to a backend
    // For now, we'll simulate form submission
    
    // Show loading state
    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Show success message
        showFormMessage('Thank you for your message! We will respond within 1-2 business days.', 'success');
        
        // Reset form
        form.reset();
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // In production: Send data to Formspree or backend
        // Example with Formspree:
        // const formData = new FormData(form);
        // fetch('https://formspree.io/f/your-form-id', {
        //     method: 'POST',
        //     body: formData,
        //     headers: {
        //         'Accept': 'application/json'
        //     }
        // })
        // .then(response => {
        //     if (response.ok) {
        //         showFormMessage('Thank you for your message! We will respond soon.', 'success');
        //         form.reset();
        //     } else {
        //         showFormMessage('There was an error sending your message. Please try again.', 'error');
        //     }
        // })
        // .catch(error => {
        //     showFormMessage('There was an error sending your message. Please try again.', 'error');
        // })
        // .finally(() => {
        //     submitBtn.innerHTML = originalText;
        //     submitBtn.disabled = false;
        // });
        
    }, 1500);
}

/**
 * Display form message
 * @param {string} message - Message to display
 * @param {string} type - Message type: 'success' or 'error'
 */
function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (!formMessage) return;
    
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// ============================================
// 7. SHOP FUNCTIONALITY
// ============================================

/**
 * Initialize shop functionality
 * Sets up filtering, search, and cart functionality
 */
function initShop() {
    // Initialize filtering
    initProductFilters();
    
    // Initialize search
    initProductSearch();
    
    // Initialize clear filters button
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
}

/**
 * Initialize product filtering
 */
function initProductFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', filterProducts);
    }
}

/**
 * Initialize product search
 */
function initProductSearch() {
    const productSearch = document.getElementById('productSearch');
    
    if (productSearch) {
        // Search as user types (with debounce)
        let searchTimeout;
        productSearch.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                filterProducts();
            }, 300);
        });
    }
}

/**
 * Filter products based on selected filters and search
 */
function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const productSearch = document.getElementById('productSearch');
    const productCards = document.querySelectorAll('.product-card');
    
    const category = categoryFilter ? categoryFilter.value : 'all';
    const price = priceFilter ? priceFilter.value : 'all';
    const searchTerm = productSearch ? productSearch.value.toLowerCase().trim() : '';
    
    let visibleCount = 0;
    
    productCards.forEach(card => {
        const productCategory = card.dataset.category;
        const productPrice = card.dataset.price;
        const productName = card.querySelector('.product-title').textContent.toLowerCase();
        const productDescription = card.querySelector('.product-description').textContent.toLowerCase();
        
        // Check category filter
        const categoryMatch = category === 'all' || productCategory === category;
        
        // Check price filter
        const priceMatch = price === 'all' || productPrice === price;
        
        // Check search filter
        let searchMatch = true;
        if (searchTerm) {
            searchMatch = productName.includes(searchTerm) || 
                         productDescription.includes(searchTerm);
        }
        
        // Show or hide card based on all filters
        if (categoryMatch && priceMatch && searchMatch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update product count display
    const productCount = document.getElementById('productCount');
    if (productCount) {
        productCount.textContent = `${visibleCount} products found`;
    }
}

/**
 * Clear all filters and search
 */
function clearFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const productSearch = document.getElementById('productSearch');
    
    if (categoryFilter) categoryFilter.value = 'all';
    if (priceFilter) priceFilter.value = 'all';
    if (productSearch) productSearch.value = '';
    
    filterProducts();
}

/**
 * Add product to cart
 * @param {Object} product - Product to add to cart
 */
function addToCart(product) {
    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count display
    updateCartCount();
    
    // Show confirmation message
    showCartNotification(`Added ${product.name} to cart`);
}

/**
 * Update cart count display in header
 */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

/**
 * Show cart notification
 * @param {string} message - Notification message
 */
function showCartNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--color-primary);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add CSS for animations if not already added
    if (!document.querySelector('#cart-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'cart-notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove notification after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// ============================================
// 8. PARTNERS MODAL
// ============================================

/**
 * Initialize partners modal functionality
 */
function initPartnersModal() {
    const modalClose = document.getElementById('modalClose');
    const partnerModal = document.getElementById('partnerModal');
    
    if (modalClose && partnerModal) {
        // Close modal when close button is clicked
        modalClose.addEventListener('click', function() {
            partnerModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
        
        // Close modal when clicking outside content
        partnerModal.addEventListener('click', function(e) {
            if (e.target === partnerModal) {
                partnerModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && partnerModal.classList.contains('active')) {
                partnerModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

/**
 * Open partner modal with partner details
 * @param {Object} partner - Partner data object
 */
function openPartnerModal(partner) {
    const partnerModal = document.getElementById('partnerModal');
    const modalPartnerName = document.getElementById('modalPartnerName');
    const modalPartnerTitle = document.getElementById('modalPartnerTitle');
    const modalPartnerBio = document.getElementById('modalPartnerBio');
    const modalPartnerCredentials = document.getElementById('modalPartnerCredentials');
    const modalPartnerSpecialties = document.getElementById('modalPartnerSpecialties');
    const modalPartnerServices = document.getElementById('modalPartnerServices');
    const modalPartnerImage = document.querySelector('.modal-partner-image .placeholder-image');
    
    if (!partnerModal) return;
    
    // Update modal content
    if (modalPartnerName) modalPartnerName.textContent = partner.name;
    if (modalPartnerTitle) modalPartnerTitle.textContent = partner.title;
    if (modalPartnerBio) modalPartnerBio.textContent = partner.bio;
    
    // Update credentials list
    if (modalPartnerCredentials) {
        modalPartnerCredentials.innerHTML = '';
        partner.credentials.forEach(credential => {
            const li = document.createElement('li');
            li.textContent = credential;
            modalPartnerCredentials.appendChild(li);
        });
    }
    
    // Update specialties tags
    if (modalPartnerSpecialties) {
        modalPartnerSpecialties.innerHTML = '';
        partner.specialties.forEach(specialty => {
            const tag = document.createElement('span');
            tag.className = 'specialty-tag';
            tag.textContent = specialty;
            modalPartnerSpecialties.appendChild(tag);
        });
    }
    
    // Update services
    if (modalPartnerServices) modalPartnerServices.textContent = partner.services;
    
    // Update image color
    if (modalPartnerImage) {
        modalPartnerImage.style.backgroundColor = partner.imageColor;
    }
    
    // Show modal
    partnerModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// ============================================
// 9. UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Get URL parameters
 * @param {string} name - Parameter name
 * @returns {string|null} Parameter value or null
 */
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}


/**
 * Simulate login for demo purposes
 * In Phase 2, this would connect to actual authentication
 */
function simulateLogin() {
    localStorage.setItem('isLoggedIn', 'true');
    showNotification('Welcome back! You can now leave reviews.', 'success');
    
    // Refresh product cards to show comment forms
    const currentPage = getCurrentPage();
    if (currentPage === 'index' || currentPage === 'shop') {
        loadPageContent();
    }
}

// Add to initialization for demo purposes
// document.addEventListener('DOMContentLoaded', function() {
//     // For demo: Uncomment to simulate logged-in user
//     // simulateLogin();
// });

// ============================================
// ADDITIONAL FUNCTIONALITY FOR FUTURE INTEGRATION
// ============================================

/**
 * This section would contain code for backend integration
 * when the website is connected to a real backend API
 */

/**
 * Example: Fetch products from backend API
 * This would replace the mockProducts data
 */
// async function fetchProductsFromAPI() {
//     try {
//         const response = await fetch('/api/products');
//         if (!response.ok) throw new Error('Network response was not ok');
//         const products = await response.json();
//         return products;
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         // Fallback to mock data
//         return mockProducts;
//     }
// }

/**
 * Example: Submit contact form to backend
 */
// async function submitContactFormToAPI(formData) {
//     try {
//         const response = await fetch('/api/contact', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(formData)
//         });
//         
//         if (!response.ok) throw new Error('Network response was not ok');
//         
//         return await response.json();
//     } catch (error) {
//         console.error('Error submitting form:', error);
//         throw error;
//     }
// }

/**
 * Initialize the website with backend data
 * Uncomment and adapt when backend is available
 */
// async function initializeWithBackend() {
//     // Load products from backend
//     const products = await fetchProductsFromAPI();
//     // Update UI with real products
//     
//     // Load articles from backend
//     // const articles = await fetchArticlesFromAPI();
//     
//     // Load partners from backend
//     // const partners = await fetchPartnersFromAPI();
// }

// Initialize with backend when available
// initializeWithBackend();