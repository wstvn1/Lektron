// Data Produk dengan kategori
const productsData = [
    {
        id: 1,
        name: 'Lampu LED Putih',
        price: 45000,
        originalPrice: 65000,
        description: 'Lampu LED hemat energi 9W, cahaya putih terang',
        category: 'led',
        rating: 4.8,
        reviews: 156
    },
    {
        id: 2,
        name: 'Lampu LED Kuning',
        price: 45000,
        originalPrice: 65000,
        description: 'Lampu LED hemat energi 9W, cahaya kuning hangat',
        category: 'led',
        rating: 4.7,
        reviews: 142
    },
    {
        id: 3,
        name: 'Lampu Bohlam Klasik',
        price: 35000,
        originalPrice: 55000,
        description: 'Bohlam tradisional 60W, desain klasik elegan',
        category: 'murah',
        rating: 4.5,
        reviews: 89
    },
    {
        id: 4,
        name: 'Lampu Neon Tabung',
        price: 85000,
        originalPrice: 125000,
        description: 'Neon tabung berterang terang untuk toko/kantor',
        category: 'premium',
        rating: 4.9,
        reviews: 203
    },
    {
        id: 5,
        name: 'Lampu Ceiling Minimalis',
        price: 125000,
        originalPrice: 175000,
        description: 'Lampu plafon modern dengan desain minimalis',
        category: 'premium',
        rating: 4.8,
        reviews: 178
    },
    {
        id: 6,
        name: 'Lampu Gantung Vintage',
        price: 150000,
        originalPrice: 220000,
        description: 'Lampu gantung gaya vintage untuk dekorasi rumah',
        category: 'premium',
        rating: 4.9,
        reviews: 245
    },
    {
        id: 7,
        name: 'Lampu Spotlight LED',
        price: 95000,
        originalPrice: 140000,
        description: 'Spotlight LED adjustable untuk highlighting',
        category: 'led',
        rating: 4.7,
        reviews: 167
    },
    {
        id: 8,
        name: 'Lampu Meja Belajar',
        price: 65000,
        originalPrice: 95000,
        description: 'Lampu meja dengan switch kontrol untuk belajar',
        category: 'murah',
        rating: 4.6,
        reviews: 121
    }
];

let cart = [];
let currentFilter = 'all';

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('all');
    setupEventListeners();
    loadCartFromStorage();
    updateCartCount();
});

// Render Produk dengan Filter
function renderProducts(filter = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    const filteredProducts = filter === 'all' 
        ? productsData 
        : productsData.filter(p => p.category === filter);

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">Produk tidak tersedia</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        const isInCart = cart.some(item => item.id === product.id);
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <i class="fas fa-lightbulb"></i>
                ${discount > 0 ? `<span class="product-badge">-${discount}%</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <small>(${product.reviews})</small>
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    ${product.originalPrice ? `<span class="product-price-old">Rp ${formatPrice(product.originalPrice)}</span>` : ''}
                    Rp ${formatPrice(product.price)}
                </div>
                <button class="add-to-cart-btn ${isInCart ? 'added' : ''}" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> 
                    ${isInCart ? 'Sudah di Keranjang' : 'Tambah Keranjang'}
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });

    currentFilter = filter;
}

// Generate Stars
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    return stars;
}

// Filter Products
function filterProducts(filter) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    renderProducts(filter);
    
    // Smooth scroll to products
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Tambah ke Keranjang
function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartCount();
    saveCartToStorage();
    showNotification(`${product.name} ditambahkan ke keranjang!`);
    
    // Update button state
    renderProducts(currentFilter);
}

// Update Cart Count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Render Cart Items
function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Keranjang belanja Anda kosong</p>
            </div>
        `;
        document.getElementById('checkoutBtn').disabled = true;
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">Rp ${formatPrice(item.price)} × ${item.quantity}</div>
            </div>
            <div class="cart-item-quantity">
                <button onclick="decreaseQuantity(${item.id})">−</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQuantity(${item.id})">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });

    updateCartTotal();
    document.getElementById('checkoutBtn').disabled = false;
}

// Update Cart Total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = formatPrice(total);
}

// Increase Quantity
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity++;
        saveCartToStorage();
        renderCartItems();
    }
}

// Decrease Quantity
function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            removeFromCart(productId);
            return;
        }
        saveCartToStorage();
        renderCartItems();
    }
}

// Remove From Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    saveCartToStorage();
    renderCartItems();
    renderProducts(currentFilter);
    showNotification('Produk dihapus dari keranjang');
}

// Format Price
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Setup Event Listeners
function setupEventListeners() {
    // Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navbarMenu = document.getElementById('navbarMenu');

    hamburger.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navbarMenu.classList.remove('active');
        });
    });

    // Cart Icon
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const continueShopping = document.getElementById('continueShopping');

    cartIcon.addEventListener('click', () => {
        cartModal.classList.add('active');
        renderCartItems();
    });

    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    continueShopping.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    // Close cart when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });

    // Checkout Button
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Keranjang belanja kosong!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const itemList = cart.map(item => `${item.name} (${item.quantity}x)`).join(', ');

    alert(`Terima kasih! Pesanan Anda:\n\n${itemList}\n\nJumlah: ${itemCount} item\nTotal: Rp ${formatPrice(total)}\n\nPesanan akan segera diproses.`);
    
    cart = [];
    updateCartCount();
    saveCartToStorage();
    renderCartItems();
    document.getElementById('cartModal').classList.remove('active');
}

// Subscribe Newsletter
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    showNotification(`Terima kasih! Email ${email} telah terdaftar ke newsletter kami.`);
    event.target.reset();
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--primary-color);
        color: var(--secondary-color);
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 300;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Save Cart to Local Storage
function saveCartToStorage() {
    localStorage.setItem('lektronCart', JSON.stringify(cart));
}

// Load Cart from Local Storage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('lektronCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// CSS untuk animasi
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
