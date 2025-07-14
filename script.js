document.addEventListener("DOMContentLoaded", () => {
  const qs = id => document.getElementById(id);
  const show = el => el?.classList.remove("hidden");
  const hide = el => el?.classList.add("hidden");

  const typedEl = qs("typed");
  let currentTypedText = "";

  const typeText = text => {
    if (!typedEl) return;
    currentTypedText = text;
    typedEl.textContent = "";
    let i = 0;
    const type = () => {
      typedEl.textContent += text.charAt(i++);
      if (i < text.length) setTimeout(type, 60);
    };
    type();
  };

  // Buka modal login
  qs("userBtn")?.addEventListener("click", () => {
    show(qs("loginModal"));
    qs("loginModal")?.classList.add("flex");
    show(qs("loginForm"));
    hide(qs("registerForm"));
    typeText("masuk");
  });

  // Ganti ke form register
  qs("switchToRegisterBtn")?.addEventListener("click", () => {
    hide(qs("loginForm"));
    show(qs("registerForm"));
    typeText("daftar");
  });

  // Ganti ke form login
  qs("switchToLoginBtn")?.addEventListener("click", () => {
    show(qs("loginForm"));
    hide(qs("registerForm"));
    typeText("Silahkan daftar jika belum punya akun");
  });

  // Tutup modal (tidak hapus teks animasi)
  qs("closeModalBtn")?.addEventListener("click", () => {
    hide(qs("loginModal"));
    qs("loginModal")?.classList.remove("flex");
    qs("loginForm")?.reset();
    qs("registerForm")?.reset();
    // typedEl.textContent tetap dibiarkan
  });
});
