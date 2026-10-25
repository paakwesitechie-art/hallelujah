
const products = [
  {
    id: 1,
    name: "Velvet Reserve",
    category: "Red Wine",
    price: 280,
    description: "Rich, deep and beautifully balanced.",
    tag: "Bestseller",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Golden Chardonnay",
    category: "White Wine",
    price: 220,
    description: "Bright citrus with a smooth finish.",
    tag: "Elegant",
    image: "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Rosé Royale",
    category: "Sparkling",
    price: 320,
    description: "A lively choice for special moments.",
    tag: "Celebration",
    image: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Midnight Cabernet",
    category: "Red Wine",
    price: 350,
    description: "Bold character with dark fruit notes.",
    tag: "Signature",
    image: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Summer Blanc",
    category: "White Wine",
    price: 190,
    description: "Fresh, crisp and easy to enjoy.",
    tag: "Fresh pick",
    image: "https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Rosé Elegance",
    category: "Sparkling",
    price: 260,
    description: "Delicate fruit notes and a refined finish.",
    tag: "Favourite",
    image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Oak Reserve",
    category: "Spirits",
    price: 420,
    description: "A warming spirit for slow evenings.",
    tag: "Premium",
    image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Ruby Select",
    category: "Red Wine",
    price: 240,
    description: "Smooth, fruit-forward and versatile.",
    tag: "Discover",
    image: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=600&q=80"
  }
];

// Replace with the owner's approved WhatsApp number.
// Use country code and digits only, without + or spaces.
const WHATSAPP_NUMBER = "233XXXXXXXXX";

let cart = [];
let activeFilter = "All";

const productGrid = document.getElementById("product-grid");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartHeadingCount = document.getElementById("cart-heading-count");
const cartTotal = document.getElementById("cart-total");
const nav = document.getElementById("nav");
const menuToggle = document.getElementById("menu-toggle");

const money = amount =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2
  }).format(amount);

function renderProducts() {
  const filteredProducts = activeFilter === "All"
    ? products
    : products.filter(product => product.category === activeFilter);

  productGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >
        <span class="product-tag">${product.tag}</span>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-bottom">
          <span class="product-price">${money(product.price)}</span>
          <button class="add-button" data-add="${product.id}">
            + Add to bag
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  activeFilter = button.dataset.filter;

  document.querySelectorAll(".filter").forEach(filter => {
    filter.classList.toggle("active", filter === button);
  });

  renderProducts();
});

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const id = Number(button.dataset.add);
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id, quantity: 1 });
  }

  renderCart();

  button.textContent = "Added ✓";
  setTimeout(() => {
    button.textContent = "+ Add to bag";
  }, 1000);
});

function renderCart() {
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const totalPrice = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  cartCount.textContent = totalItems;
  cartHeadingCount.textContent = `(${totalItems})`;
  cartTotal.textContent = money(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-cart">Your bag is empty. Discover a bottle you love.</p>';
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);

    return `
      <div class="cart-item">
        <div>
          <h3>${product.name}</h3>
          <p>${money(product.price)} each</p>
          <div class="quantity-controls">
            <button data-decrease="${product.id}" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button data-increase="${product.id}" aria-label="Increase quantity">+</button>
            <button class="remove-item" data-remove="${product.id}">Remove</button>
          </div>
        </div>
        <strong>${money(product.price * item.quantity)}</strong>
      </div>
    `;
  }).join("");
}

cartItems.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = Number(
    button.dataset.increase ||
    button.dataset.decrease ||
    button.dataset.remove
  );

  const item = cart.find(entry => entry.id === id);
  if (!item) return;

  if (button.hasAttribute("data-increase")) {
    item.quantity++;
  } else if (button.hasAttribute("data-decrease")) {
    item.quantity--;
    if (item.quantity <= 0) {
      cart = cart.filter(entry => entry.id !== id);
    }
  } else {
    cart = cart.filter(entry => entry.id !== id);
  }

  renderCart();
});

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("close-cart").focus();
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.getElementById("open-cart").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
document.getElementById("continue-shopping").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

function orderOnWhatsApp() {
  if (cart.length === 0) {
    alert("Your bag is empty. Add a bottle first.");
    return;
  }

  if (!/^233\d{9}$/.test(WHATSAPP_NUMBER)) {
    alert("Demo mode: add the store owner's approved WhatsApp number in script.js before testing checkout.");
    return;
  }

  const lines = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return `${product.name} x ${item.quantity} - ${money(product.price * item.quantity)}`;
  });

  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  const message = [
    "Hello Velvet Cellars! I'd like to enquire about this order:",
    "",
    ...lines,
    "",
    `Subtotal: ${money(total)}`,
    "",
    "Please confirm availability and delivery details."
  ].join("\n");

  const url =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

document.getElementById("checkout").addEventListener("click", orderOnWhatsApp);
document.getElementById("ask-whatsapp").addEventListener("click", () => {
  if (!/^233\d{9}$/.test(WHATSAPP_NUMBER)) {
    alert("Demo mode: add the store owner's approved WhatsApp number in script.js before testing WhatsApp.");
    return;
  }

  const message = "Hello Velvet Cellars! I'd like help choosing a wine.";
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer"
  );
});

renderProducts();
renderCart();
