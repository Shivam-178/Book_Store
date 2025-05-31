// Book data with categories
const books = [
  { title: 'The Forgotten Library', author: 'A. Reynolds', price: 5.75, image: 'https://picsum.photos/200/300?random=1', category: 'Fiction' },
  { title: 'Whispers in the Wind', author: 'Clara Myles', price: 6.5, image: 'https://picsum.photos/200/300?random=2', category: 'Fiction' },
  { title: 'Echoes of the Past', author: 'J.T. Simmons', price: 7.25, image: 'https://picsum.photos/200/300?random=3', category: 'Mystery' },
  { title: 'Midnight on Maple Street', author: 'Nora Blake', price: 8.0, image: 'https://picsum.photos/200/300?random=4', category: 'Fiction' },
  { title: 'Tales from the Emberlands', author: 'Harlan King', price: 8.75, image: 'https://picsum.photos/200/300?random=5', category: 'Fantasy' },
  { title: 'The Silent Key', author: 'Eliza Moore', price: 9.5, image: 'https://picsum.photos/200/300?random=6', category: 'Thriller' },
  { title: 'Chasing the Shadow', author: 'Derek Hunt', price: 10.25, image: 'https://picsum.photos/200/300?random=7', category: 'Horror' },
  { title: 'The Cipher Room', author: 'Maya Gill', price: 11.0, image: 'https://picsum.photos/200/300?random=8', category: 'Mystery' },
  { title: 'Deadlock Diaries', author: 'Ryan Park', price: 11.75, image: 'https://picsum.photos/200/300?random=9', category: 'Thriller' },
  { title: 'The Ninth Clue', author: 'Tasha Quinn', price: 12.5, image: 'https://picsum.photos/200/300?random=10', category: 'Fiction' },
  { title: 'The Last Starship', author: 'Colin Reiss', price: 13.25, image: 'https://picsum.photos/200/300?random=11', category: 'Science Fiction' },
  { title: 'Chronicles of the Void', author: 'Luna Vega', price: 14.0, image: 'https://picsum.photos/200/300?random=12', category: 'Fantasy' },
  { title: 'Dragonfall', author: 'Eldon Sharp', price: 14.75, image: 'https://picsum.photos/200/300?random=13', category: 'Fiction' },
  { title: 'The Time Alchemist', author: 'Sophie Lane', price: 15.5, image: 'https://picsum.photos/200/300?random=14', category: 'Science Fiction' },
  { title: 'Neon Realms', author: 'Kai Torres', price: 16.25, image: 'https://picsum.photos/200/300?random=15', category: 'Fantasy' },
  { title: 'Love Under the Lantern Sky', author: 'Daisy Rose', price: 17.0, image: 'https://picsum.photos/200/300?random=16', category: 'Romance' },
  { title: 'Hearts in Harmony', author: 'Bennett Grace', price: 17.75, image: 'https://picsum.photos/200/300?random=17', category: 'Romance' },
  { title: 'A Promise at Dusk', author: 'Mira Shaw', price: 18.5, image: 'https://picsum.photos/200/300?random=18', category: 'Historical Fiction' },
  { title: 'Unlocking Your Inner Drive', author: 'Dr. K. Mehta', price: 19.25, image: 'https://picsum.photos/200/300?random=19', category: 'Non-Fiction' },
  { title: 'The Focus Formula', author: 'Terry Bloom', price: 20.0, image: 'https://picsum.photos/200/300?random=20', category: 'Non-Fiction' },
  { title: 'Empires of the Past', author: 'Richard Langdon', price: 20.75, image: 'https://picsum.photos/200/300?random=21', category: 'Historical Fiction' }
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

// Update cart - structured table with quantity update buttons
function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;

  if (Object.keys(cart).length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty.</p>';
    cartTotal.textContent = '';
    return;
  }

  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';

  // Header
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr style="border-bottom: 2px solid #ccc;">
      <th style="text-align:left; padding: 8px;">Title</th>
      <th style="text-align:right; padding: 8px;">Price</th>
      <th style="text-align:center; padding: 8px;">Quantity</th>
      <th style="text-align:right; padding: 8px;">Total</th>
      <th style="text-align:center; padding: 8px;">Remove</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  Object.values(cart).forEach(item => {
    total += item.price * item.qty;
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid #ddd';

    const safeId = encodeId(item.title);

    tr.innerHTML = `
      <td style="padding:8px;">${item.title}</td>
      <td style="padding:8px; text-align:right;">₹${item.price.toFixed(2)}</td>
      <td style="padding:8px; text-align:center;">
        <button onclick="changeCartQty('${item.title}', -1)" style="margin-right:6px;">-</button>
        <span id="cart-qty-${safeId}">${item.qty}</span>
        <button onclick="changeCartQty('${item.title}', 1)" style="margin-left:6px;">+</button>
      </td>
      <td style="padding:8px; text-align:right;">₹${(item.price * item.qty).toFixed(2)}</td>
      <td style="padding:8px; text-align:center;">
        <button onclick="removeFromCart('${item.title}')" style="color:red; font-weight:bold;">×</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  cartItems.appendChild(table);

  cartTotal.textContent = `Total: ₹${total.toFixed(2)}`;
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

// Login modal open/close
function openLogin() {
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

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Page navigation
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

// Initialize app on load
window.onload = showWelcome;
