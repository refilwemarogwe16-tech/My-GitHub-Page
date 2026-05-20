// ========== LOGIN VALIDATION ==========
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if(username === 'customer' && password === 'customer123') {
            localStorage.setItem('currentUser', 'customer');
            window.location.href = 'customer-dashboard.html';
        } else if(username === 'admin' && password === 'admin123') {
            localStorage.setItem('currentUser', 'admin');
            window.location.href = 'admin-dashboard.html';
        } else {
            alert('Invalid username or password!');
        }
    });
}

// ========== PRODUCT DATA ==========
let products = [];

function loadProducts() {
    const savedProducts = localStorage.getItem('products');
    if(savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Default products
        products = [
            { id: 1, name: 'Storm Hoodie', price: 49.99, category: 'Hoodie', image: 'images/hoodie1.jpg' },
        ];
        saveProducts();
    }
}

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// ========== PRODUCTS ON CUSTOMER DASHBOARD ==========
function displayCustomerProducts() {
    const hoodieContainer = document.getElementById('hoodieProducts');
    const leggingsContainer = document.getElementById('leggingsProducts');
    
    if(hoodieContainer) {
        const hoodies = products.filter(p => p.category === 'Hoodie');
        const leggings = products.filter(p => p.category === 'Leggings');
        
        hoodieContainer.innerHTML = '';
        leggingsContainer.innerHTML = '';
        
        hoodies.forEach(product => {
            hoodieContainer.appendChild(createProductCard(product));
        });
        
        leggings.forEach(product => {
            leggingsContainer.appendChild(createProductCard(product));
        });
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.src='https://via.placeholder.com/200x180?text=No+Image'">
        <h3>${product.name}</h3>
        <p>BWP${product.price}</p>
        <button class="buy-btn" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
    `;
    
    card.querySelector('.buy-btn').addEventListener('click', function() {
        alert(`${product.name} added to cart! $${product.price}`);
    });
    
    return card;
}

// ========== PRODUCT MANAGEMENT ==========
function displayAdminProducts() {
    const adminList = document.getElementById('adminProductList');
    if(adminList) {
        adminList.innerHTML = '';
        products.forEach(product => {
            const item = document.createElement('div');
            item.className = 'admin-product-item';
            item.innerHTML = `
                <div class="admin-product-info">
                    <img src="${product.image}" class="admin-product-img" onerror="this.src='https://via.placeholder.com/50x50?text=No+Image'">
                    <span><strong>${product.name}</strong> - BWP${product.price} (${product.category})</span>
                </div>
                <button class="delete-btn" data-id="${product.id}">Delete</button>
            `;
            adminList.appendChild(item);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                products = products.filter(p => p.id !== id);
                saveProducts();
                displayAdminProducts();
                alert('Product deleted!');
            });
        });
    }
}

// ========== ADD PRODUCT  ==========
if(document.getElementById('addProductForm')) {
    document.getElementById('addProductForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('prod-name').value;
        const price = parseFloat(document.getElementById('prod-price').value);
        const category = document.getElementById('prod-category').value;
        const imageFile = document.getElementById('prod-image').files[0];
        
        if(imageFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 7;
                const newProduct = {
                    id: newId,
                    name: name,
                    price: price,
                    category: category,
                    image: event.target.result
                };
                products.push(newProduct);
                saveProducts();
                displayAdminProducts();
                document.getElementById('addProductForm').reset();
                alert('DONE!');
            };
            reader.readAsDataURL(imageFile);
        } else {
            alert('Select an image!');
        }
    });
}

// ========== FEEDBACK ==========
let feedbacks = [];

function loadFeedbacks() {
    const savedFeedbacks = localStorage.getItem('feedbacks');
    if(savedFeedbacks) {
        feedbacks = JSON.parse(savedFeedbacks);
    } else {
        // Default feedbacks
        feedbacks = [
            { id: 1, name: 'Sarah M.', rating: 5, ratingText: 'Excellent', message: 'Best hoodie I have ever owned! Super comfortable and stylish.' },
        ];
        saveFeedbacks();
    }
}

function saveFeedbacks() {
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
}

function displayFeedbacks() {
    const feedbackList = document.getElementById('feedbackList');
    if(feedbackList) {
        feedbackList.innerHTML = '';
        feedbacks.forEach(fb => {
            const item = document.createElement('div');
            item.className = 'review-item';
            item.innerHTML = `
                <strong>${fb.name}</strong>
                <div class="rating">${fb.ratingText}</div>
                <p>"${fb.message}"</p>
                ${isAdminPage() ? `<button class="delete-feedback" data-id="${fb.id}">Delete Review</button>` : ''}
            `;
            feedbackList.appendChild(item);
        });
        
        if(isAdminPage()) {
            document.querySelectorAll('.delete-feedback').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.dataset.id);
                    feedbacks = feedbacks.filter(f => f.id !== id);
                    saveFeedbacks();
                    displayFeedbacks();
                    alert('Review deleted!');
                });
            });
        }
    }
}

function isAdminPage() {
    return window.location.pathname.includes('admin-dashboard.html');
}

// ========== SUBMIT FEEDBACK ==========
if(document.getElementById('feedbackForm')) {
    document.getElementById('feedbackForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('fb-name').value;
        const rating = document.getElementById('rating').value;
        const message = document.getElementById('fb-message').value;
        
        let ratingText = '';
        switch(rating) {
            case '5': ratingText = 'Excellent'; break;
            case '4': ratingText = 'Good'; break;
            case '3': ratingText = 'Average'; break;
            case '2': ratingText = 'Poor'; break;
            case '1': ratingText = 'Very Bad'; break;
        }
        
        const newId = feedbacks.length > 0 ? Math.max(...feedbacks.map(f => f.id)) + 1 : 1;
        const newFeedback = {
            id: newId,
            name: name,
            rating: parseInt(rating),
            ratingText: ratingText,
            message: message
        };
        
        feedbacks.unshift(newFeedback);
        saveFeedbacks();
        displayFeedbacks();
        document.getElementById('feedbackForm').reset();
        alert('Thank you for your feedback!');
        
        setTimeout(() => {
            window.location.href = 'customer-dashboard.html';
        }, 1500);
    });
}

// ========== CONTACT FORM ==========
if(document.getElementById('contactForm')) {
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for contacting us! We will respond within 24 hours.');
        this.reset();
    });
}

// ========== INITIALIZE PAGE ==========
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadFeedbacks();
    displayCustomerProducts();
    displayAdminProducts();
    displayFeedbacks();
});
