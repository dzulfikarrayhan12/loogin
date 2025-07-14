// Utility function
const qs = id => document.getElementById(id);

// ============================
// DATA PRODUK
// ============================
const products = [
  { id: "hitam", name: "Baju Hitam", displayName: "BAJU HITAM", price: 100000, image: "images/1.jpg", rating: 5 },
  { id: "putih", name: "Baju Putih", displayName: "BAJU PUTIH", price: 100000, image: "images/2.jpg", rating: 5 },
  { id: "merah", name: "Baju Merah", displayName: "BAJU MERAH", price: 100000, image: "images/3.jpg", rating: 5 },
  { id: "hoodie hitam", name: "hoodie hitam", displayName: "hoodie hitam", price: 200000, image: "images/4.jpg", rating: 5 },
  { id: "hoodie merah", name: "hoodie merah", displayName: "hoodie merah", price: 200000, image: "images/5.jpg", rating: 5 },
  { id: "hoodie putih", name: "hoodie putih", displayName: "hoodie putih", price: 200000, image: "images/6.jpg", rating: 5 },
];

// ============================
// RENDER PRODUK
// ============================
function createStarRating(rating) {
  const ratingDiv = document.createElement('div');
  ratingDiv.className = 'product-rating';
  for (let i = 0; i < 5; i++) {
    const star = document.createElement('i');
    star.className = i < rating ? 'ri-star-fill text-warning' : 'ri-star-line text-muted';
    ratingDiv.appendChild(star);
  }
  return ratingDiv;
}

function createSizeButtons(label) {
  const sizes = ['M', 'L', 'XL'];
  const wrapper = document.createElement('div');
  wrapper.className = 'size-buttons d-flex gap-1';
  wrapper.setAttribute('role', 'group');
  wrapper.setAttribute('aria-label', label);

  sizes.forEach(size => {
    const btn = document.createElement('button');
    btn.className = 'size-btn btn btn-outline-secondary btn-sm';
    btn.textContent = size;
    wrapper.appendChild(btn);
  });

  return wrapper;
}

function renderProducts(productList, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  productList.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.dataset.name = product.name;
    card.dataset.price = product.price;
    card.dataset.image = product.image;

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.displayName;
    img.className = 'product-image';

    const name = document.createElement('h3');
    name.className = 'product-name';
    name.textContent = product.displayName;

    const price = document.createElement('p');
    price.className = 'product-price';
    price.textContent = `Rp${product.price.toLocaleString("id-ID")}`;

    const stars = createStarRating(product.rating);
    const sizes = createSizeButtons(`Ukuran ${product.name}`);

    const addBtn = document.createElement('button');
    addBtn.className = 'add-to-cart-btn btn btn-success mt-2';
    addBtn.textContent = 'Tambah Keranjang';

    // EVENT: Tambah ke keranjang
    addBtn.addEventListener("click", () => {
      const sizeBtn = card.querySelector(".size-btn.active");
      if (!sizeBtn) return alert("Pilih ukuran terlebih dahulu!");
      const size = sizeBtn.textContent;

      addToCart({ id: product.id, name: product.name, size, price: product.price, image: product.image });
    });

    // EVENT: Pilih ukuran
    const sizeBtns = sizes.querySelectorAll(".size-btn");
    sizeBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        sizeBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    card.append(img, name, stars, price, sizes, addBtn);
    container.appendChild(card);
  });
}

// ============================
// KERANJANG
// ============================
let cart = JSON.parse(localStorage.getItem("checkout") || "[]");

function saveCart() {
  localStorage.setItem("checkout", JSON.stringify(cart));
}

function updateCartCount() {
  const cartCount = qs("cart-count");
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = count > 0 ? count : "";
  cartCount.style.display = count > 0 ? "flex" : "none";
}

function updateCartUI() {
  const container = qs("cart-items");
  const totalEl = qs("cart-total");
  container.innerHTML = "";
  let total = 0;

  cart.forEach(({ id, name, size, price, image, qty }) => {
    total += price * qty;
    const item = document.createElement("div");
    item.className = "cart-item";
    item.innerHTML = `
      <img src="${image}" alt="${name}">
      <div class="cart-item-info">
        <div>${name}</div>
        <div class="cart-item-size">Size: ${size}</div>
        <div class="cart-item-price">Rp${(price * qty).toLocaleString("id-ID")}</div>
      </div>
      <div class="cart-item-qty">${qty}</div>
      <div class="cart-item-remove text-danger cursor-pointer"><i class="ri-delete-bin-line"></i></div>
    `;
    item.querySelector(".cart-item-remove").onclick = () => {
      cart = cart.filter(i => !(i.id === id && i.size === size));
      saveCart();
      updateCartUI();
    };
    container.appendChild(item);
  });

  totalEl.textContent = "Rp" + total.toLocaleString("id-ID");
  updateCartCount();
}

function addToCart(product) {
  const index = cart.findIndex(i => i.id === product.id && i.size === product.size);
  if (index > -1) cart[index].qty += 1;
  else cart.push({ ...product, qty: 1 });
  saveCart();
  updateCartUI();
}

// ============================
// EVENT DOMContentLoaded
// ============================
document.addEventListener("DOMContentLoaded", () => {
  // Sidebar, Overlay
  const modal = qs("loginModal");
  const menuToggle = qs("menu-toggle");
  const cartToggle = qs("cart-toggle");
  const sidebarMenu = qs("sidebar-menu");
  const sidebarCart = qs("sidebar-cart");
  const overlay = qs("overlay");
  const checkoutBtn = qs("checkout-btn");
  const loginBtn = qs("loginBtn");
  const closeBtn = document.querySelector(".close");

  function closeAll() {
    sidebarMenu?.classList.remove("open");
    sidebarCart?.classList.remove("open");
    overlay?.classList.remove("active");
  }

  menuToggle?.addEventListener("click", () => {
    sidebarMenu.classList.toggle("open");
    sidebarCart?.classList.remove("open");
    overlay.classList.toggle("active", sidebarMenu.classList.contains("open"));
  });

  cartToggle?.addEventListener("click", () => {
    sidebarCart.classList.toggle("open");
    sidebarMenu?.classList.remove("open");
    overlay.classList.toggle("active", sidebarCart.classList.contains("open"));
  });

  overlay?.addEventListener("click", closeAll);

  loginBtn?.addEventListener("click", e => {
    e.preventDefault();
    modal.style.display = "block";
  });

  closeBtn?.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });

  checkoutBtn?.addEventListener("click", () => {
    if (cart.length === 0) return alert("Keranjang kosong!");
    window.location.href = "checkout.html";
  });

  renderProducts(products, "product");
  updateCartUI();
});

// ============================
// SWITCH LOGIN / REGISTER
// ============================
const showLogin = qs("showLogin");
const showRegister = qs("showRegister");
const loginForm = qs("loginForm");
const registerForm = qs("registerForm");

showLogin?.addEventListener("click", () => {
  loginForm?.classList.remove("d-none");
  registerForm?.classList.add("d-none");
  showLogin.classList.add("text-primary");
  showRegister.classList.remove("text-primary");
});

showRegister?.addEventListener("click", () => {
  loginForm?.classList.add("d-none");
  registerForm?.classList.remove("d-none");
  showRegister.classList.add("text-primary");
  showLogin.classList.remove("text-primary");
});

 const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const sidebar = document.getElementById('sidebar-menu');
  const overlay = document.getElementById('sidebar-overlay');

  menuToggle.addEventListener('click', () => {
    sidebar.style.display = 'flex'; // Ganti class hidden
    overlay.classList.remove('hidden');
  });

  menuClose.addEventListener('click', () => {
    sidebar.style.display = 'none';
    overlay.classList.add('hidden');
  });

  overlay.addEventListener('click', () => {
    sidebar.style.display = 'none';
    overlay.classList.add('hidden');
  });

   window.togglePassword = id => {
    const input = qs(id);
    const icon = input?.parentElement?.querySelector("i");
    if (!input || !icon) return;
    const isPw = input.type === "password";
    input.type = isPw ? "text" : "password";
    icon.className = isPw
      ? "ri-eye-off-line absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 cursor-pointer"
      : "ri-eye-line absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 cursor-pointer";
  };

  // ======================
  // === Sidebar Toggle ===
  // ======================
  ['menuBtn', 'sidebarOverlay', 'closeSidebar'].forEach(id =>
    qs(id)?.addEventListener('click', () => {
      qs("sidebar")?.classList.toggle("-translate-x-full");
      qs("sidebarOverlay")?.classList.toggle("hidden");
    })
  );

  // ============================
  // === Modal Login/Register ===
  // ============================
  const typedEl = qs("typed");
  const typeText = text => {
    if (!typedEl) return;
    typedEl.textContent = "";
    let i = 0;
    const type = () => {
      typedEl.textContent += text.charAt(i++);
      if (i < text.length) setTimeout(type, 80);
    };
    type();
  };

  qs("userBtn")?.addEventListener("click", () => {
    show(qs("loginModal"));
    show(qs("loginForm"));
    hide(qs("registerForm"));
    qs("loginModal").classList.add("flex");
    typeText("masuk");
  });

  qs("switchToRegisterBtn")?.addEventListener("click", () => {
    hide(qs("loginForm"));
    show(qs("registerForm"));
    typeText("daftar");
  });

  qs("switchToLoginBtn")?.addEventListener("click", () => {
    show(qs("loginForm"));
    hide(qs("registerForm"));
    typeText("Silahkan daftar jika belum punya akun");
  });

  qs("closeModalBtn")?.addEventListener("click", () => {
    hide(qs("loginModal"));
    qs("loginModal").classList.remove("flex");
    qs("loginForm")?.reset();
    qs("registerForm")?.reset();
    if (typedEl) typedEl.textContent = "";
  });

  // ========================
  // === Login/Register Form ===
  // ========================
  qs("loginForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const { username, password } = e.target;
    if (!username.value.trim() || !password.value) return alert("Isi semua data!");
    alert(`Login berhasil: ${username.value}`);
    hide(qs("loginModal")); e.target.reset();
  });

  qs("registerForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = e.target;
    if (!username.value || !email.value || !password.value || !confirmPassword.value)
      return alert("Lengkapi semua data!");
    if (password.value !== confirmPassword.value)
      return alert("Password tidak sama!");
    alert(`Register berhasil: ${username.value}`);
    hide(qs("loginModal")); e.target.reset();
  });
