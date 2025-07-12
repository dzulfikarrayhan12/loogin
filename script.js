document.addEventListener("DOMContentLoaded", () => {
  // =======================
  // === Utility Methods ===
  // =======================
  const qs = id => document.getElementById(id);
  const show = el => el?.classList.remove("hidden");
  const hide = el => el?.classList.add("hidden");

  // ====================
  // === Scroll Hide ===
  // ====================
  const hanPart = qs("han-part");
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (!hanPart) return;
    hanPart.classList.add("hidden");
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => hanPart.classList.remove("hidden"), 1000);
  });

  // ========================
  // === Toggle Password ===
  // ========================
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
    typeText("Silahkan daftar jika belum punya akun");
  });

  qs("switchToRegisterBtn")?.addEventListener("click", () => {
    hide(qs("loginForm"));
    show(qs("registerForm"));
    typeText("Silahkan login jika sudah punya akun");
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

  // ============================
  // === Produk & Keranjang ===
  // ============================
  const container = qs("product-container");
  const cartCount = qs("cart-count");
  const descriptions = ["baju hitam", "baju putih", "baju merah", "hoodie hitam","hoodie merah","hoodie putih", "hoodie hijau",];
  const prices = [50000, 50000, 50000,100000,100000,100000,100000,];

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("checkout") || "[]");
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    cartCount.textContent = totalQty ? totalQty : "";
    cartCount.style.display = totalQty ? "flex" : "none";
  };

  const createProduct = (i, desc, price) => {
    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded-lg shadow flex flex-col";
    div.innerHTML = `
      <img src="images/${i}.jpg" class="w-full h-[420px] object-contain rounded-md mb-2" alt="Produk ${i}" />
      <h3 class="text-lg font-semibold mb-1">Produk ${i}</h3>
      <p class="text-gray-600 text-sm mb-2">${desc.replace(/\n/g, "<br>")}</p>
      <div class="text-black-500 font-bold mb-2">Rp${price.toLocaleString("id-ID")}</div>
      <select class="ukuran-baju w-full mb-3 px-3 py-2 rounded border border-gray-300">
        <option value="M">Ukuran M</option>
        <option value="L">Ukuran L</option>
        <option value="XL">Ukuran XL</option>
      </select>
      <button class="mt-auto bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 relative">
        <i class="ri-shopping-bag-3-line absolute left-4"></i><span>Tambah ke Keranjang</span>
      </button>
    `;
    div.querySelector("button").addEventListener("click", () => {
      const selectedSize = div.querySelector("select")?.value || "M";
      const item = {
        title: `Produk ${i}`,
        desc: `${desc} (Ukuran: ${selectedSize})`,
        price: `Rp${price.toLocaleString("id-ID")}`,
        image: `images/${i}.jpg`,
        qty: 1,
        size: selectedSize
      };
      const cart = JSON.parse(localStorage.getItem("checkout") || "[]");
      const existing = cart.find(p => p.title === item.title && p.size === item.size);
      existing ? existing.qty++ : cart.push(item);
      localStorage.setItem("checkout", JSON.stringify(cart));
      updateCartCount();
    });
    return div;
  };

  if (container) {
    for (let i = 1; i <= 7; i++) {
      const desc = descriptions[(i - 1) % descriptions.length];
      const price = prices[(i - 1) % prices.length];
      container.appendChild(createProduct(i, desc, price));
    }
    updateCartCount();
  }

  // ====================
  // === Checkout Page ===
  // ====================
  if (window.location.pathname.includes("checkout.html")) {
    const checkoutList = qs("checkout-list");
    const totalPriceEl = qs("total-price");
    let cart = JSON.parse(localStorage.getItem("checkout") || "[]");

    const updateTotal = () => {
      const total = cart.reduce((sum, item) =>
        sum + parseInt(item.price.replace(/\D/g, "")) * (item.qty || 1), 0);
      totalPriceEl.textContent = `Rp${total.toLocaleString("id-ID")}`;
    };

    const saveCart = () => {
      localStorage.setItem("checkout", JSON.stringify(cart));
      renderCart(); updateCartCount();
    };

    window.changeQty = (i, d) => {
      if (!cart[i]) return;
      cart[i].qty += d;
      if (cart[i].qty <= 0) cart.splice(i, 1);
      saveCart();
    };

    window.removeItem = i => {
      cart.splice(i, 1);
      saveCart();
    };

    const renderCart = () => {
      checkoutList.innerHTML = "";
      if (cart.length === 0) {
        checkoutList.innerHTML = `<div class="text-center text-gray-500 mt-10">Keranjang kosong.</div>`;
        totalPriceEl.textContent = "Rp0";
        return;
      }
      cart.forEach((item, i) => {
        const div = document.createElement("div");
        div.className = "bg-white p-4 rounded-lg shadow flex items-center gap-4";
        div.innerHTML = `
          <img src="${item.image}" class="w-20 h-20 object-cover rounded" />
          <div class="flex-1">
            <h3 class="text-md font-semibold">${item.title}</h3>
            <p class="text-sm text-gray-500">${item.desc}</p>
            <p class="text-orange-500 font-bold mt-1">${item.price}</p>
            <div class="flex gap-2 mt-2">
              <button onclick="changeQty(${i}, -1)" class="bg-gray-400 hover:bg-gray-600 text-white px-2 py-1 rounded">-</button>
              <span class="px-3">${item.qty}</span>
              <button onclick="changeQty(${i}, 1)" class="bg-gray-700 hover:bg-gray-900 text-white px-2 py-1 rounded">+</button>
            </div>
          </div>
          <button onclick="removeItem(${i})" class="text-red-500 hover:text-red-700">
            <i class="ri-delete-bin-line text-xl"></i>
          </button>
        `;
        checkoutList.appendChild(div);
      });
      updateTotal();
    };

    renderCart();
  }

  // ============================
  // === Checkout Submission ===
  // ============================
  qs("pay-btn")?.addEventListener("click", () => {
    const name = qs("name")?.value.trim();
    const address = qs("address")?.value.trim();
    const phone = qs("phone")?.value.trim();
    const method = qs("payment-method")?.value;
    const note = qs("note")?.value.trim();
    if (!name || !address || !phone || !method)
      return alert("Mohon lengkapi semua data pembayaran.");

    const history = JSON.parse(localStorage.getItem("history") || "[]");
    history.push({
      items: JSON.parse(localStorage.getItem("checkout") || "[]"),
      total: qs("total-price")?.textContent,
      time: new Date().toLocaleString(),
      status: "Belum Dibayar",
      customer: { name, address, phone, method, note }
    });
    localStorage.setItem("history", JSON.stringify(history));
    localStorage.removeItem("checkout");
    alert("Pesanan berhasil disimpan.");
    window.location.href = "index.html";
  });

  // ===================
  // === Navigation ===
  // ===================
  window.goBack = () => (window.location.href = "index.html");
  window.loadPage = page => {
    fetch(page)
      .then(res => res.text())
      .then(html => (qs("content").innerHTML = html))
      .catch(err => (qs("content").innerHTML = `<p style="color:red;">${err.message}</p>`));
  };
});


