// ── CART STATE ──
let cart = [];

// ── ADD TO CART ──
const addButtons = document.querySelectorAll('.add-btn');

addButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();

    const choice = btn.closest('.menu-choice');
    const name = choice.querySelector('.choice-name').textContent;
    const priceText = choice.querySelector('.choice-price').textContent;
    const price = parseFloat(priceText.replace('₱', '').replace('/serving', '').trim());
    const img = choice.querySelector('img').src;

    addToCart(name, price, img);
  });
});

function addToCart(name, price, img) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, img, qty: 1 });
  }
  renderCart();
}

function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  renderCart();
}

function changeQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.name !== name);
  }
  renderCart();
}

// ── RENDER CART ──
function renderCart() {
  const cartItemsEl = document.getElementById('cart-items');
  const cartCountEl = document.getElementById('cart-count');
  const subtotalEl  = document.getElementById('subtotal');
  const serviceEl   = document.getElementById('service');
  const totalEl     = document.getElementById('total');

  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  cartCountEl.textContent = totalQty;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <div>Your cart is empty.<br>Add items from the menu!</div>
      </div>`;
    subtotalEl.textContent = '₱0.00';
    serviceEl.textContent  = '₱0.00';
    totalEl.textContent    = '₱0.00';
    return;
  }

  // Build cart items HTML (no inline onclick)
  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item" data-name="${item.name}">
      <img class="ci-img" src="${item.img}" alt="${item.name}">
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">₱${item.price.toFixed(2)}</div>
      </div>
      <div class="ci-controls">
        <button class="ci-btn remove" data-action="remove" data-name="${item.name}">✕</button>
        <span class="ci-qty">${item.qty}</span>
        <button class="ci-btn" data-action="add" data-name="${item.name}">+</button>
      </div>
    </div>
  `).join('');

  // Attach events to freshly rendered cart buttons
  cartItemsEl.querySelectorAll('.ci-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const name   = btn.dataset.name;
      if (action === 'remove') removeFromCart(name);
      if (action === 'add')    changeQty(name, 1);
    });
  });

  // Update totals
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const service  = subtotal * 0.05;
  const total    = subtotal + service;

  subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
  serviceEl.textContent  = `₱${service.toFixed(2)}`;
  totalEl.textContent    = `₱${total.toFixed(2)}`;
}

// ── SIDEBAR CATEGORY SWITCHING ──
const categItems = document.querySelectorAll('.categ-item');
categItems.forEach(item => {
  item.addEventListener('click', () => {
    categItems.forEach(c => c.classList.remove('active'));
    item.classList.add('active');
  });
});

// ── FILTER TYPES ──
const filterTypes = document.querySelectorAll('.filter-types');
filterTypes.forEach(pill => {
  pill.addEventListener('click', () => {
    filterTypes.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });
});
