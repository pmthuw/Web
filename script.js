// ======================= TÌM KIẾM SẢN PHẨM =======================

// 🌸 Hàm tìm kiếm hoa
function searchFlowers() {
  const input = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  const products = document.querySelectorAll(".product");
  const noResult = document.getElementById("noResult");

  let found = false;

  products.forEach((product) => {
    const name = product.querySelector("h3").textContent.toLowerCase();
    if (name.includes(input)) {
      product.style.display = "block";
      found = true;
    } else {
      product.style.display = "none";
    }
  });

  // Nếu không nhập gì → hiện lại tất cả
  if (input === "") {
    products.forEach((p) => (p.style.display = "block"));
    noResult.style.display = "none";
    return;
  }

  // Hiện thông báo nếu không tìm thấy sản phẩm
  noResult.style.display = found ? "none" : "block";
}

// 🪷 Khi bấm vào gợi ý tìm kiếm
function quickSearch(keyword) {
  const input = document.getElementById("searchInput");
  input.value = keyword;
  searchFlowers();
  const container = document.querySelector(".product-container");
  if (container) {
    window.scrollTo({ top: container.offsetTop - 100, behavior: "smooth" });
  }
}

// 🪷 Tạo gợi ý dưới thanh tìm kiếm
function createSuggestions() {
  const suggestionArea = document.createElement("div");
  suggestionArea.className = "suggestions";

  const suggestions = [
    "Hoa hồng",
    "Hoa ngày lễ",
    "Hoa dịp đặc biệt",
    "Hoa kính viếng",
    "Phụ kiện",
  ];

  suggestions.forEach((s) => {
    const btn = document.createElement("button");
    btn.className = "suggestion-btn";
    btn.innerText = s;
    btn.onclick = () => quickSearch(s);
    suggestionArea.appendChild(btn);
  });

  const searchBar = document.querySelector(".search-bar");
  if (searchBar) searchBar.insertAdjacentElement("afterend", suggestionArea);
}

// ======================= GIỎ HÀNG =======================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 🪷 Thêm sản phẩm vào giỏ
function addToCart(name, price, image) {
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("✅ Đã thêm sản phẩm vào giỏ hàng!");
  updateCartCount();
}

// 🪷 Cập nhật số lượng hiển thị ở góc
function updateCartCount() {
  const cartCount = document.querySelector("#cartCount");
  if (cartCount) {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = total;
  }
}

// 🪷 Hiển thị giỏ hàng
function showCart() {
  const cartTable = document.querySelector("#cartTable tbody");
  const totalElement = document.querySelector("#cartTotal");
  if (!cartTable || !totalElement) return;

  cartTable.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartTable.innerHTML = `<tr><td colspan="6">Giỏ hàng trống.</td></tr>`;
    totalElement.textContent = "0đ";
    return;
  }

  cart.forEach((item, index) => {
    const priceNum = parseInt(item.price.replace(/\D/g, ""));
    const sum = priceNum * item.quantity;
    total += sum;

    const row = `
            <tr>
                <td><img src="${item.image}" alt="${
      item.name
    }" class="cart-img"></td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td><input type="number" min="1" value="${
                  item.quantity
                }" class="qty-input" data-index="${index}"></td>
                <td>${sum.toLocaleString()}đ</td>
                <td><button class="remove-btn" data-index="${index}">🗑️</button></td>
            </tr>
        `;
    cartTable.innerHTML += row;
  });

  totalElement.textContent = total.toLocaleString() + "đ";

  // Xóa sản phẩm
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      cart.splice(btn.dataset.index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      showCart();
      updateCartCount();
    });
  });

  // Thay đổi số lượng
  document.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", () => {
      const i = input.dataset.index;
      cart[i].quantity = parseInt(input.value);
      localStorage.setItem("cart", JSON.stringify(cart));
      showCart();
      updateCartCount();
    });
  });
}

// ======================= THANH TOÁN =======================

function setupCheckout() {
  const totalEl = document.querySelector("#checkoutTotal");
  const form = document.querySelector("#checkoutForm");
  const message = document.querySelector("#checkoutMessage");

  if (!totalEl || !form) return;

  const total = cart.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/\D/g, ""));
    return sum + price * item.quantity;
  }, 0);

  totalEl.textContent = total.toLocaleString() + "đ";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    const order = {
      name: form.fullname.value,
      phone: form.phone.value,
      address: form.address.value,
      note: form.note.value,
      payment: form.paymentMethod.value,
      items: cart,
      total: total,
      date: new Date().toLocaleString(),
    };

    localStorage.setItem("lastOrder", JSON.stringify(order));
    localStorage.removeItem("cart");
    cart = [];

    message.innerHTML = `
            <div class="success">
                🎉 Cảm ơn ${order.name}! Đơn hàng của bạn đã được xác nhận.<br>
                Tổng tiền: <b>${total.toLocaleString()}đ</b><br>
                Phương thức: <b>${
                  order.payment === "cash" ? "COD" : "Chuyển khoản"
                }</b><br>
                Ngày đặt: ${order.date}
            </div>
        `;
    form.reset();
    updateCartCount();
  });
}

// ======================= LỊCH SỬ MUA HÀNG =======================

function showOrderHistory() {
  const historyContainer = document.querySelector("#orderHistory");
  if (!historyContainer) return;

  const order = JSON.parse(localStorage.getItem("lastOrder"));

  if (order) {
    let html = `
            <div class="order-summary">
                <h3>Đơn hàng gần nhất của bạn</h3>
                <p><b>Khách hàng:</b> ${order.name}</p>
                <p><b>SĐT:</b> ${order.phone}</p>
                <p><b>Địa chỉ:</b> ${order.address}</p>
                <p><b>Ngày đặt:</b> ${order.date}</p>
                <p><b>Phương thức thanh toán:</b> ${
                  order.payment === "cash" ? "COD" : "Chuyển khoản"
                }</p>
                <h4>🪷 Danh sách sản phẩm:</h4>
                <div class="order-items">
                    ${order.items
                      .map(
                        (item) => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}">
                            <div>
                                <h5>${item.name}</h5>
                                <p>Số lượng: ${item.quantity}</p>
                                <p>Giá: ${item.price}</p>
                            </div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                <p class="order-total"><b>Tổng tiền:</b> ${order.total.toLocaleString()}đ</p>
            </div>
        `;
    historyContainer.innerHTML = html;
  } else {
    historyContainer.innerHTML = `
            <p>🕊️ Bạn chưa mua sản phẩm nào.</p>
            <p>Hãy xem các sản phẩm nổi bật dưới đây:</p>
            <div class="suggested-products">
                <a href="category-hoatinhyeu.html" class="suggest-btn">Hoa Tình Yêu</a>
                <a href="category-hoangayle.html" class="suggest-btn">Hoa Ngày Lễ</a>
                <a href="category-hoagaubong.html" class="suggest-btn">Hoa Gấu Bông</a>
                <a href="category-hoagio.html" class="suggest-btn">Hoa Giỏ</a>
                <a href="category-phukien.html" class="suggest-btn">Phụ kiện</a>
            </div>
        `;
  }
}

// ======================= KHI TRANG LOAD =======================

document.addEventListener("DOMContentLoaded", () => {
  createSuggestions();
  updateCartCount();
  showCart();
  setupCheckout();
  showOrderHistory();

  // Bắt sự kiện search
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.addEventListener("keyup", searchFlowers);

  // Thêm vào giỏ
  document.querySelectorAll(".cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const product = btn.closest(".product");
      const name = product.querySelector("h3").innerText;
      const price = product.querySelector("p").innerText.replace("Giá: ", "");
      const image = product.querySelector("img").src;
      addToCart(name, price, image);
    });
  });
});

localStorage.setItem(
  "cart",
  JSON.stringify([
    {
      name: "Bó hoa Hồng đỏ",
      price: 450000,
      image: "hoahong1.jpg",
      quantity: 1,
    },
  ])
);
