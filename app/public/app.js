const state = { products: [], filter: "All", cart: {} };
const $ = (selector) => document.querySelector(selector);
const money = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

function renderProducts() {
  const visible = state.products.filter((product) => state.filter === "All" || product.category === state.filter);
  const grid = $("#product-grid");
  if (!visible.length) {
    grid.innerHTML = '<div class="empty-state">No products in this collection yet.</div>';
    return;
  }
  grid.innerHTML = visible.map((product) => `
    <article class="product-card">
      <div class="product-visual">
        <span class="product-tag">${product.category}</span>
        <span class="product-emoji" aria-hidden="true">${product.emoji}</span>
      </div>
      <div class="product-info">
        <div class="product-title-row"><div><h3 class="product-title">${product.name}</h3><p class="product-category">${product.id}</p></div><span class="product-price">${money(product.price)}</span></div>
        <div class="product-bottom"><span class="stock-note">${product.stock > 10 ? "Ready for your routine" : "Limited quantity"}</span><button class="add-button" data-add="${product.id}" aria-label="Add ${product.name} to bag">+</button></div>
      </div>
    </article>`).join("");
}

function cartCount() {
  return Object.values(state.cart).reduce((sum, quantity) => sum + quantity, 0);
}

function renderCart() {
  const count = cartCount();
  $("#cart-count").textContent = count;
  $("#drawer-count").textContent = `(${count})`;
  const entries = Object.entries(state.cart).filter(([, quantity]) => quantity > 0);
  const items = $("#cart-items");
  if (!entries.length) {
    items.innerHTML = '<p class="empty-cart">Your bag is taking a little breather.</p>';
  } else {
    items.innerHTML = entries.map(([id, quantity]) => {
      const product = state.products.find((item) => item.id === id);
      if (!product) return "";
      return `<div class="cart-line"><div class="cart-line-emoji">${product.emoji}</div><div class="cart-line-main"><strong>${product.name}</strong><small>${money(product.price)} each</small><div class="quantity-control"><button data-qty="${id}" data-delta="-1" aria-label="Remove one ${product.name}">−</button><span>${quantity}</span><button data-qty="${id}" data-delta="1" aria-label="Add one ${product.name}">+</button></div></div><strong>${money(product.price * quantity)}</strong></div>`;
    }).join("");
  }
  const total = entries.reduce((sum, [id, quantity]) => {
    const product = state.products.find((item) => item.id === id);
    return sum + (product ? product.price * quantity : 0);
  }, 0);
  $("#cart-total").textContent = money(total);
}

function openCart(open) {
  $("#cart-drawer").classList.toggle("open", open);
  $("#drawer-backdrop").classList.toggle("open", open);
  $("#cart-drawer").setAttribute("aria-hidden", String(!open));
}

let toastTimer;
function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove("show"), 2200);
}

function formatUptime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

async function refreshOperations() {
  try {
    const [health, ops] = await Promise.all([getJson("/api/health"), getJson("/api/ops")]);
    $("#service-status").textContent = health.status === "healthy" ? "Operational" : "Attention needed";
    $("#service-message").textContent = `API responding · ${health.service}`;
    $("#app-version").textContent = ops.version;
    $("#app-environment").textContent = `Environment · ${ops.environment}`;
    $("#app-uptime").textContent = formatUptime(ops.uptimeSeconds);
    $("#node-version").textContent = `${ops.nodeVersion} · ${ops.platform}`;
    $("#last-checked").textContent = `Last checked ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
  } catch (_error) {
    $("#service-status").textContent = "Unavailable";
    $("#service-message").textContent = "Could not reach the health endpoint";
    $("#last-checked").textContent = "Health check failed";
  }
}

document.addEventListener("click", (event) => {
  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) {
    state.filter = filterButton.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((button) => button.classList.toggle("selected", button === filterButton));
    renderProducts();
  }
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    const product = state.products.find((item) => item.id === addButton.dataset.add);
    state.cart[product.id] = (state.cart[product.id] || 0) + 1;
    renderCart();
    toast(`${product.name} added to your bag`);
  }
  const quantityButton = event.target.closest("[data-qty]");
  if (quantityButton) {
    const id = quantityButton.dataset.qty;
    state.cart[id] = (state.cart[id] || 0) + Number(quantityButton.dataset.delta);
    if (state.cart[id] <= 0) delete state.cart[id];
    renderCart();
  }
});

$("#cart-toggle").addEventListener("click", () => openCart(true));
$("#cart-close").addEventListener("click", () => openCart(false));
$("#drawer-backdrop").addEventListener("click", () => openCart(false));
$("#checkout-button").addEventListener("click", () => toast("Demo only — checkout is not connected yet."));

(async function init() {
  try {
    state.products = await getJson("/api/products");
    renderProducts();
  } catch (_error) {
    $("#product-grid").innerHTML = '<div class="empty-state">The collection could not load. Please refresh the page.</div>';
  }
  renderCart();
  refreshOperations();
  setInterval(refreshOperations, 15000);
})();
