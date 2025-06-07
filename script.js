// Book data with categories
const books = [
  
  // Fantasy
  { title: 'The Lord of the Rings Set', author: 'J.R.R. Tolkien', price: 4000, image: 'https://m.media-amazon.com/images/I/81MQBzDw6ZL._SL1500_.jpg', category: 'Fantasy' },
  { title: 'Harry Potter and the Philosopher\'s Stone', author: 'J.K. Rowling', price: 350, image: 'https://m.media-amazon.com/images/I/91-SvQ4I17L._SL1500_.jpg', category: 'Fantasy' },
  { title: 'Game of Thrones Set', author: 'George R.R. Martin', price: 6000, image: 'https://m.media-amazon.com/images/I/61xlw1p2V2L._SL1080_.jpg', category: 'Fantasy' },
  
  
  // Science Fiction
  { title: 'Dune Set', author: 'Frank Herbert', price: 5000, image: 'https://m.media-amazon.com/images/I/711wjwwJQYL._SL1500_.jpg', category: 'Science Fiction' },
  { title: 'Foundation', author: 'Isaac Asimov', price: 480, image: 'https://m.media-amazon.com/images/I/61yavG4+MYS._SL1000_.jpg', category: 'Science Fiction' },

  // Fiction
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 300, image: 'https://m.media-amazon.com/images/I/81gepf1eMqL._SL1500_.jpg', category: 'Fiction' },
  { title: '1984', author: 'George Orwell', price: 400, image: 'https://m.media-amazon.com/images/I/81fcLJo+FNL._SL1500_.jpg', category: 'Fiction' },
  
  // Mystery
  { title: 'Gone Girl', author: 'Gillian Flynn', price: 450, image: 'https://m.media-amazon.com/images/I/61Sx28fdUoL._SL1500_.jpg', category: 'Mystery' },
  { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', price: 500, image: 'https://m.media-amazon.com/images/I/81YW99XIpJL._SL1500_.jpg', category: 'Mystery' },
  
  // Horror
  { title: 'Dracula', author: 'Bram Stoker', price: 320, image: 'https://m.media-amazon.com/images/I/91bgZLTqz0L._SL1500_.jpg', category: 'Horror' },
  { title: 'The Exorcist', author: 'William Peter Blatty', price: 420, image: 'https://m.media-amazon.com/images/I/71gnmyiJGnL._SL1500_.jpg', category: 'Horror' }
];

// Cart object keyed by title
let cart = {};

// DOM Elements
const bookList = document.getElementById('book-list');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

// Utility to find book by title
function findBookByTitle(title) {
  return books.find(book => book.title === title);
}

// Utility to encode strings for element IDs
function encodeId(str) {
  return encodeURIComponent(str).replace(/%/g, '');
}

// Change quantity input in store view
function changeInputQty(title, delta) {
  const inputId = `qty-input-${encodeId(title)}`;
  const input = document.getElementById(inputId);
  if (!input) return;
  let val = parseInt(input.value) || 1;
  val += delta;
  if (val < 1) val = 1;
  if (val > 99) val = 99;
  input.value = val;
}

// Display books with quantity controls
function displayBooks(filteredBooks = null) {
  const search = document.getElementById('search').value.toLowerCase();
  let toDisplay = filteredBooks ? filteredBooks : books;

  if (!filteredBooks) {
    toDisplay = toDisplay.filter(b => b.title.toLowerCase().includes(search));
  }

  bookList.innerHTML = '';

  toDisplay.forEach(book => {
    const inputId = `qty-input-${encodeId(book.title)}`;
    const bookEl = document.createElement('div');
    bookEl.className = 'book';
    bookEl.innerHTML = `
      <img src="${book.image}" alt="Cover of ${book.title}">
      <h3>${book.title}</h3>
      <p>by ${book.author}</p>
      <p>₹${book.price.toFixed(2)}</p>
      <div class="qty-selector" style="display:flex; gap:5px; align-items:center; justify-content:center; margin-bottom: 5px;">
        <button onclick="changeInputQty('${book.title}', -1)">-</button>
        <input type="number" min="1" max="99" value="1" id="${inputId}" style="width:40px; text-align:center;"/>
        <button onclick="changeInputQty('${book.title}', 1)">+</button>
      </div>
      <button class="add-btn" onclick="addToCart('${book.title}')">Add to Cart</button>
    `;
    bookList.appendChild(bookEl);
  });
}

// Add book to cart with quantity from input
function addToCart(title) {
  const inputId = `qty-input-${encodeId(title)}`;
  const input = document.getElementById(inputId);
  let qty = 1;
  if (input) {
    qty = parseInt(input.value);
    if (isNaN(qty) || qty < 1) qty = 1;
    if (qty > 99) qty = 99;
  }
  const book = findBookByTitle(title);
  if (!book) return;
  if (cart[title]) {
    cart[title].qty += qty;
  } else {
    cart[title] = { ...book, qty: qty };
  }
  alert(`${qty} copy/copies of "${title}" added to cart.`);
  updateCart();
}

// styled cart
function updateCart() {
  const cartContainer = document.getElementById('cart-items');
  cartContainer.innerHTML = '';
  let total = 0;

  if (Object.keys(cart).length === 0) {
    cartContainer.innerHTML = '<div style="text-align:center; color:#666; padding:40px;"><p>Your cart is empty</p><p>🛍️</p></div>';
    document.getElementById('cart-total').textContent = '';
    return;
  }

  Object.values(cart).forEach(item => {
    total += item.price * item.qty;
    const cartItem = document.createElement('div');
    cartItem.style.cssText = 'display:flex; align-items:center; padding:15px 0; border-bottom:1px solid #eee;';
    
    cartItem.innerHTML = `
      <div style="flex:1;">
        <h4 style="margin:0 0 5px; font-size:16px;">${item.title}</h4>
        <p style="margin:0; color:#666; font-size:14px;">₹${item.price.toFixed(2)} each</p>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <button onclick="changeCartQty('${item.title}', -1)" style="width:30px; height:30px; border:1px solid #ddd; background:white; border-radius:50%; cursor:pointer;">-</button>
        <span style="min-width:20px; text-align:center; font-weight:600;">${item.qty}</span>
        <button onclick="changeCartQty('${item.title}', 1)" style="width:30px; height:30px; border:1px solid #ddd; background:white; border-radius:50%; cursor:pointer;">+</button>
        <button onclick="removeFromCart('${item.title}')" style="margin-left:10px; background:#dc3545; color:white; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer; font-weight:bold;">×</button>
      </div>
    `;
    cartContainer.appendChild(cartItem);
  });

  document.getElementById('cart-total').textContent = `₹${total.toFixed(2)}`;
}

// Change quantity in cart
function changeCartQty(title, delta) {
  if (!cart[title]) return;
  cart[title].qty += delta;
  if (cart[title].qty <= 0) {
    delete cart[title];
  }
  updateCart();
}

// Remove item from cart
function removeFromCart(title) {
  delete cart[title];
  updateCart();
}

// Cart modal toggle
function toggleCart() {
  const modal = document.getElementById('cart-modal');
  modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

// Login/Signup modal functions
function openLogin() {
  closeSignup();
  document.getElementById('login-modal').style.display = 'flex';
}

function closeLogin() {
  document.getElementById('login-modal').style.display = 'none';
}

function openSignup() {
  closeLogin();
  document.getElementById('signup-modal').style.display = 'flex';
}

function closeSignup() {
  document.getElementById('signup-modal').style.display = 'none';
}

// Form submission handlers
document.addEventListener('DOMContentLoaded', function() {
  // Login form handler
  const loginForm = document.querySelector('#login-modal .auth-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Login successful!');
      closeLogin();
    });
  }

  // Signup form handler
  const signupForm = document.querySelector('#signup-modal .auth-form');
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Account created successfully!');
      closeSignup();
    });
  }
});

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Page navigation functions
function showWelcome() {
  document.getElementById('welcome-page').style.display = 'block';
  document.getElementById('book-store').style.display = 'none';
  document.getElementById('category-page').style.display = 'none';
  document.getElementById('contact-page').style.display = 'none';
}

function showBookStore() {
  document.getElementById('welcome-page').style.display = 'none';
  document.getElementById('book-store').style.display = 'block';
  document.getElementById('category-page').style.display = 'none';
  document.getElementById('contact-page').style.display = 'none';
  displayBooks();
}

function showCategory() {
  document.getElementById('welcome-page').style.display = 'none';
  document.getElementById('book-store').style.display = 'none';
  document.getElementById('category-page').style.display = 'block';
  document.getElementById('contact-page').style.display = 'none';
}

function showContact() {
  document.getElementById('welcome-page').style.display = 'none';
  document.getElementById('book-store').style.display = 'none';
  document.getElementById('category-page').style.display = 'none';
  document.getElementById('contact-page').style.display = 'block';
}

// Filter books by category
function filterByCategory(category) {
  const filteredBooks = books.filter(book => book.category === category);
  document.getElementById('welcome-page').style.display = 'none';
  document.getElementById('book-store').style.display = 'block';
  document.getElementById('category-page').style.display = 'none';
  document.getElementById('contact-page').style.display = 'none';
  displayBooks(filteredBooks);
}

// Checkout function
function proceedToCheckout() {
  if (Object.keys(cart).length === 0) {
    alert('Your cart is empty! Please add some books before checkout.');
    return;
  }
  
  // Calculate total
  const total = Object.values(cart).reduce((sum, item) => sum + (item.price * item.qty), 0);
  const itemCount = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  
  // Show order confirmation
  alert(`🎉 Order Placed Successfully!\n\nItems: ${itemCount} book(s)\nTotal: ₹${total.toFixed(2)}\n\nThank you for shopping with BookBazaar!`);
  
  // Clear cart and close modal
  cart = {};
  updateCart();
  toggleCart();
}

// Initialize app on load
window.onload = showWelcome;