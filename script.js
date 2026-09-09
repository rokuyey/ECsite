"use strict";

{
  // ==========================================
  // 商品基本データの一元管理
  // ==========================================
  const products = [
    {
      id: 1,
      name: "国産 杉無垢角材（構造・造作用）",
      category: "wood",
      desc: "特等 / 乾燥材 105mm × 105mm × 3m",
      price: 12500,
      unit: "本",
      stock: 15,
      img: "https://picsum.photos",
    },
    {
      id: 2,
      name: "プロ用 充電式ディスクグラインダ",
      category: "tools",
      desc: "高効率ブラシレスモータ搭載 / 18V対応",
      price: 18500,
      unit: "台",
      stock: 0,
      img: "https://picsum.photos",
    },
    {
      id: 3,
      name: "RR-055MTT(MB)",
      category: "electric",
      desc: "水銀灯400W相当 / 防雨・防塵型 / 昼白色",
      price: 48000,
      unit: "台",
      stock: 3,
      img: "images/RR-055MTT(MB).jpg",
    },
    {
      id: 4,
      name: "RT64JH6S2-GL",
      category: "electric",
      desc: "水銀灯400W相当 / 防雨・防塵型 / 昼白色",
      price: 48000,
      unit: "台",
      stock: 3,
      img: "images/RT64JH6S2-GL.jpg",
    },
    {
      id: 5,
      name: "RTS65AWK14RGA-CL",
      category: "electric",
      desc: "水銀灯400W相当 / 防雨・防塵型 / 昼白色",
      price: 48000,
      unit: "台",
      stock: 3,
      img: "images/RTS65AWK14RGA-CL.jpg",
    },
    {
      id: 6,
      name: "センス60cmガラス",
      category: "electric",
      desc: "水銀灯400W相当 / 防雨・防塵型 / 昼白色",
      price: 48000,
      unit: "台",
      stock: 3,
      img: "images/センス60cmガラス.jpg",
    },
    {
      id: 7,
      name: "断熱材 グラスウールマット（住宅壁用）",
      category: "wood",
      desc: "厚さ100mm × 幅430mm × 長さ1370mm / 24K",
      price: 8900,
      unit: "ケース",
      stock: 50,
      img: "https://picsum.photos",
    },
  ];

  // ==========================================
  // 【パワーアップ】ローカルストレージ（保存機能）の読み込み
  // ==========================================
  // ページを開いたとき、前回保存されたデータがあれば読み込み、無ければ空にする
  let cart = JSON.parse(localStorage.getItem("bizmart_cart")) || {};
  let favorites = JSON.parse(localStorage.getItem("bizmart_favorites")) || [];
  let currentCategory = "all";

  // データをブラウザに保存する共通の関数
  function saveToLocalStorage() {
    localStorage.setItem("bizmart_cart", JSON.stringify(cart));
    localStorage.setItem("bizmart_favorites", JSON.stringify(favorites));
  }

  // ==========================================
  // 商品一覧の動的表示
  // ==========================================
  function renderProducts() {
    const grid = document.getElementById("products-grid");
    if (!grid) return;
    grid.innerHTML = "";

    let filteredProducts = products;

    if (currentCategory === "favorites") {
      filteredProducts = filteredProducts.filter((product) =>
        favorites.includes(product.id),
      );
    } else if (currentCategory !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === currentCategory,
      );
    }

    if (filteredProducts.length === 0) {
      grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #777; padding: 40px 0;">該当する商品は現在ありません。</p>`;
      return;
    }

    filteredProducts.forEach((product) => {
      const isSoldOut = product.stock === 0;
      const isFav = favorites.includes(product.id);
      const currentQty = cart[product.id] || 0;

      let stockText = `在庫あり (残り ${product.stock}${product.unit})`;
      let stockClass = "ok";

      if (isSoldOut) {
        stockText = "完売しました";
        stockClass = "none";
      } else if (product.stock <= 5) {
        stockText = `残りわずか！ (あと ${product.stock}${product.unit})`;
        stockClass = "low";
      }

      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
      <div class="product-img-wrapper">
        <button type="button" class="fav-btn ${isFav ? "active" : ""}" data-id="${product.id}">
          ${isFav ? "★" : "☆"}
        </button>
        <img src="${product.img}" alt="${product.name}" class="product-img">
        ${isSoldOut ? `<div class="sold-out-overlay">SOLD OUT</div>` : ""}
      </div>
      <h2 class="product-title">${product.name}</h2>
      <p class="product-desc">${product.desc}</p>
      <p class="product-price">¥${product.price.toLocaleString()} / ${product.unit}</p>
      <p class="stock-status ${stockClass}">${stockText}</p>
      
      <div class="quantity-control">
        ${
          isSoldOut
            ? `
          <button type="button" class="add-list-btn" disabled>受付停止中</button>
        `
            : `
          <button type="button" class="qty-btn btn-minus" data-id="${product.id}">-</button>
          <span class="qty-num">${currentQty}</span>
          <button type="button" class="qty-btn btn-plus" data-id="${product.id}">+</button>
        `
        }
      </div>
    `;

      grid.appendChild(card);
    });

    setupFavoriteButtons();
    setupMainQuantityButtons();
  }

  function filterCategory(category, element) {
    document
      .querySelectorAll(".nav-tabs .tab-btn")
      .forEach((btn) => btn.classList.remove("active"));
    if (element) {
      element.classList.add("active");
    }
    currentCategory = category;
    renderProducts();
  }

  function setupFavoriteButtons() {
    const favButtons = document.querySelectorAll(".product-card .fav-btn");
    favButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const productId = parseInt(button.getAttribute("data-id"));
        if (favorites.includes(productId)) {
          favorites = favorites.filter((id) => id !== productId);
        } else {
          favorites.push(productId);
        }
        saveToLocalStorage(); // 【パワーアップ】お気に入り変更時に即保存
        renderProducts();
      });
    });
  }

  function setupMainQuantityButtons() {
    document.querySelectorAll(".product-card .btn-plus").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = parseInt(button.getAttribute("data-id"));
        changeQuantity(productId, 1);
      });
    });
    document.querySelectorAll(".product-card .btn-minus").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = parseInt(button.getAttribute("data-id"));
        changeQuantity(productId, -1);
      });
    });
  }

  // 数量増減コアロジック
  function changeQuantity(productId, amount) {
    const product = products.find((p) => p.id === productId);
    if (!product || product.stock === 0) return;

    const currentQty = cart[productId] || 0;
    const newQty = currentQty + amount;

    if (newQty <= 0) {
      delete cart[productId];
    } else if (newQty > product.stock) {
      alert(
        `申し訳ありません。この商品は在庫数（最大 ${product.stock}${product.unit}）を超えて選択できません。`,
      );
      return;
    } else {
      cart[productId] = newQty;
    }

    saveToLocalStorage(); // 【パワーアップ】カート数量変更時に即保存
    renderProducts();
    updateCartSummary();
  }

  // 右側サイドバーの更新
  function updateCartSummary() {
    const cartContainer = document.getElementById("cart-items");
    const totalAmountEl = document.getElementById("total-amount");
    if (!cartContainer || !totalAmountEl) return;

    cartContainer.innerHTML = "";
    let totalPrice = 0;

    const cartKeys = Object.keys(cart);

    if (cartKeys.length === 0) {
      cartContainer.innerHTML = `<p style="text-align: center; color: #999; font-size: 13px; padding: 20px 0;">選択された商品はありません。</p>`;
      totalAmountEl.textContent = "¥0";
      return;
    }

    cartKeys.forEach((id) => {
      const productId = parseInt(id);
      const product = products.find((p) => p.id === productId);
      const qty = cart[productId];
      const subtotal = product.price * qty;
      totalPrice += subtotal;

      const itemRow = document.createElement("div");
      itemRow.className = "cart-item";
      itemRow.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-name">${product.name}</span>
        <span class="cart-item-subtotal">¥${subtotal.toLocaleString()}</span>
      </div>
      <div class="cart-item-actions">
        <button type="button" class="sidebar-qty-btn sidebar-minus" data-id="${productId}">-</button>
        <span class="sidebar-qty-num">${qty}</span>
        <button type="button" class="sidebar-qty-btn sidebar-plus" data-id="${productId}">+</button>
      </div>
    `;
      cartContainer.appendChild(itemRow);
    });

    totalAmountEl.textContent = `¥${totalPrice.toLocaleString()}`;
    setupSidebarQuantityButtons();
  }

  function setupSidebarQuantityButtons() {
    document.querySelectorAll(".cart-item .sidebar-plus").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = parseInt(button.getAttribute("data-id"));
        changeQuantity(productId, 1);
      });
    });
    document.querySelectorAll(".cart-item .sidebar-minus").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = parseInt(button.getAttribute("data-id"));
        changeQuantity(productId, -1);
      });
    });
  }

  // ==========================================
  // 【パワーアップ】メール注文テキストの自動生成関数
  // ==========================================
  function sendOrderEmail() {
    const mailAddress = "order@example.com"; // 受付用の会社メールアドレス（仮）
    const subject = encodeURIComponent(
      "【見積依頼】BizMart Pro Webカタログより",
    );

    // メールの本文を組み立てる
    let bodyText = "BizMart Pro 営業担当者様\n\n";
    bodyText += "Webサイトより以下の商品の見積もりを依頼いたします。\n";
    bodyText += "----------------------------------------\n";

    let totalPrice = 0;
    Object.keys(cart).forEach((id) => {
      const productId = parseInt(id);
      const product = products.find((p) => p.id === productId);
      const qty = cart[productId];
      const subtotal = product.price * qty;
      totalPrice += subtotal;

      bodyText += `■商品名：${product.name}\n`;
      bodyText += `  仕様　：${product.desc}\n`;
      bodyText += `  数量　：${qty} ${product.unit}\n`;
      bodyText += `  単価　：¥${product.price.toLocaleString()}（税別）\n`;
      bodyText += `  小計　：¥${subtotal.toLocaleString()}（税別）\n\n`;
    });

    bodyText += "----------------------------------------\n";
    bodyText += `【御見積合計金額】：¥${totalPrice.toLocaleString()}（税別）\n\n`;
    bodyText += "貴社名：\n";
    bodyText += "御担当者様名：\n";
    bodyText += "お電話番号：\n";
    bodyText += "ご希望納期・備考：\n";

    const body = encodeURIComponent(bodyText);

    // メールアプリを立ち上げる特別なURL（mailto）を発動させる
    window.location.href = `mailto:${mailAddress}?subject=${subject}&body=${body}`;
  }

  // ==========================================
  // ページ読み込み時の初期化と各種監視設定
  // ==========================================
  document.addEventListener("DOMContentLoaded", () => {
    // 初回表示
    renderProducts();
    updateCartSummary();

    // カテゴリータブのクリック監視
    const tabButtons = document.querySelectorAll(".nav-tabs .tab-btn");
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.getAttribute("data-category");
        filterCategory(category, button);
      });
    });

    // 右下固定ボタンのスクロール監視
    const floatingCartBtn = document.getElementById("floating-cart-btn");
    const sidebarSummary = document.querySelector(".sidebar-summary");

    if (floatingCartBtn && sidebarSummary) {
      floatingCartBtn.addEventListener("click", () => {
        sidebarSummary.scrollIntoView({ behavior: "smooth" });
      });
    }
    // ポップアップ（モーダル）を開閉する監視
    const quoteBtn = document.getElementById("quote-btn");
    const orderModal = document.getElementById("order-modal");
    const modalCloseBtn = document.getElementById("modal-close-btn");

    if (quoteBtn && orderModal && modalCloseBtn) {
      quoteBtn.addEventListener("click", () => {
        if (Object.keys(cart).length === 0) {
          alert("見積もりリストに商品が追加されていません。");
          return;
        }
        orderModal.classList.add("show");
      });
      modalCloseBtn.addEventListener("click", () => {
        orderModal.classList.remove("show");
      });
    }
    // 💡【パワーアップ】ポップアップ内の「メールでの注文」ボタンをクリックした時
    const emailOrderBtn = document.querySelector(".modal-choice-btn.email-btn");
    if (emailOrderBtn) {
      emailOrderBtn.addEventListener("click", () => {
        sendOrderEmail(); // 自動テキスト付きメール送信を実行
      });
    }
  });
}
