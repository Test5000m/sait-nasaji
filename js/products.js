(function () {
  "use strict";

  let productsCache = null;


  async function getProducts() {

    if (productsCache) {
      return productsCache;
    }

    try {

      const response =
        await fetch(
          window.SITE_CONFIG.productsUrl,
          {
            cache: "no-cache"
          }
        );

      if (!response.ok) {
        throw new Error(
          "Products file could not be loaded."
        );
      }

      const data =
        await response.json();

      if (!Array.isArray(data)) {
        throw new Error(
          "products.json must contain an array."
        );
      }

      productsCache = data;

      return productsCache;

    } catch (error) {

      console.error(
        "Product loading error:",
        error
      );

      return [];

    }

  }


  async function getProductById(id) {

    const products =
      await getProducts();

    return products.find(
      product =>
        Number(product.id) === Number(id)
    );

  }


  function createProductCard(product) {

    const favorite =
      Wishlist.isFavorite(product.id);

    const image =
      Utils.getProductImage(product);

    const hasDiscount =
      Number(product.discount) > 0;

    const inStock =
      Number(product.stock) > 0;

    const oldPrice =
      Number(product.oldPrice) > 0
        ? `
          <span class="old">
            ${Utils.formatPrice(product.oldPrice)}
          </span>
        `
        : "";


    return `
      <article class="card product-card">

        <button
          class="heart ${favorite ? "active" : ""}"
          data-wishlist="${product.id}"
          aria-label="افزودن به علاقه‌مندی"
        >
          ${favorite ? "♥" : "♡"}
        </button>


        <a
          href="product.html?id=${encodeURIComponent(product.id)}"
          class="product-image-link"
        >

          <div class="product-img">

            <img
              src="${Utils.escapeHTML(image)}"
              alt="${Utils.escapeHTML(product.name || "پارچه")}"
              loading="lazy"
              onerror="this.src=Utils.getPlaceholder('نساجی بزرگمهر')"
            >

          </div>

        </a>


        <div class="card-body">

          <span class="tag">
            ${Utils.escapeHTML(product.category || "پارچه")}
          </span>


          <h3>
            <a
              href="product.html?id=${encodeURIComponent(product.id)}"
            >
              ${Utils.escapeHTML(product.name || "محصول")}
            </a>
          </h3>


          <div class="rating">

            <span>
              ${Utils.stars(product.rating)}
            </span>

            <small>
              ${
                product.rating
                  ? Utils.escapeHTML(product.rating)
                  : "بدون امتیاز"
              }
            </small>

          </div>


          <div class="price-row">

            <strong class="price">
              ${
                Number(product.price) > 0
                  ? Utils.formatPrice(product.price)
                  : "تماس بگیرید"
              }
            </strong>

            ${oldPrice}

          </div>


          ${
            hasDiscount
              ? `
                <span class="discount-badge">
                  ${Utils.formatNumber(product.discount)}٪ تخفیف
                </span>
              `
              : ""
          }


          <div
            class="stock ${
              inStock ? "in" : "out"
            }"
          >
            ${
              inStock
                ? `موجودی: ${Utils.formatNumber(product.stock)}`
                : "ناموجود"
            }
          </div>


          <div class="card-actions">

            <a
              class="small-btn alt"
              href="product.html?id=${encodeURIComponent(product.id)}"
            >
              مشاهده
            </a>


            <button
              class="small-btn"
              data-add-cart="${product.id}"
              ${!inStock ? "disabled" : ""}
            >
              افزودن به سبد
            </button>

          </div>

        </div>

      </article>
    `;

  }


  function renderProducts(
    products,
    container
  ) {

    if (!container) {
      return;
    }

    if (!products.length) {

      container.innerHTML = `
        <div class="empty full-width">
          <h3>محصولی پیدا نشد</h3>
          <p class="muted">
            عبارت جستجو یا فیلترهای خود را تغییر دهید.
          </p>
        </div>
      `;

      return;

    }


    container.innerHTML =
      products
        .map(createProductCard)
        .join("");

  }


  function getCategories(products) {

    return [
      ...new Set(
        products
          .map(product => product.category)
          .filter(Boolean)
      )
    ];

  }


  function renderCategories(
    products,
    container
  ) {

    if (!container) {
      return;
    }

    const categories =
      getCategories(products);


    if (!categories.length) {

      container.innerHTML = `
        <div class="empty">
          هنوز دسته‌بندی محصولی ثبت نشده است.
        </div>
      `;

      return;

    }


    container.innerHTML =
      categories
        .map((category, index) => `
          <a
            class="cat"
            href="shop.html?category=${encodeURIComponent(category)}"
          >

            <span class="cat-icon">
              ${
                ["▧", "◇", "◌", "✦"][index % 4]
              }
            </span>

            <strong>
              ${Utils.escapeHTML(category)}
            </strong>

            <small class="muted">
              مشاهده محصولات ←
            </small>

          </a>
        `)
        .join("");

  }


  window.Products = {

    getProducts,
    getProductById,
    createProductCard,
    renderProducts,
    getCategories,
    renderCategories

  };

})();
