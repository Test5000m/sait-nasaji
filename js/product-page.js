(function () {
  "use strict";

  async function initProductPage() {

    const id =
      Utils.getQueryParam("id");


    const container =
      document.getElementById(
        "product-detail"
      );


    if (!container) {
      return;
    }


    if (!id) {

      container.innerHTML = `
        <div class="empty">
          <h2>محصول مشخص نشده است.</h2>
          <a href="shop.html" class="btn">
            بازگشت به فروشگاه
          </a>
        </div>
      `;

      return;

    }


    const product =
      await Products.getProductById(id);


    if (!product) {

      container.innerHTML = `
        <div class="empty">
          <h2>محصول پیدا نشد.</h2>
          <a href="shop.html" class="btn">
            بازگشت به فروشگاه
          </a>
        </div>
      `;

      return;

    }


    renderProduct(
      product,
      container
    );

  }


  function renderProduct(
    product,
    container
  ) {

    const images =
      Array.isArray(product.images) &&
      product.images.length
        ? product.images
        : [Utils.getProductImage(product)];


    const firstImage =
      images[0];


    const inStock =
      Number(product.stock || 0) > 0;


    const favorite =
      Wishlist.isFavorite(
        product.id
      );


    container.innerHTML = `

      <div class="product-detail">

        <section>

          <div
            id="main-product-image"
            class="gallery-main"
          >

            <img
              src="${Utils.escapeHTML(firstImage)}"
              alt="${Utils.escapeHTML(product.name)}"
              onerror="this.src=Utils.getPlaceholder('نساجی بزرگمهر')"
            >

          </div>


          <div class="thumbs">

            ${images.map((image, index) => `

              <button
                class="thumb"
                data-image="${Utils.escapeHTML(image)}"
              >

                <img
                  src="${Utils.escapeHTML(image)}"
                  alt="${Utils.escapeHTML(product.name)} ${index + 1}"
                  loading="lazy"
                  onerror="this.src=Utils.getPlaceholder('نساجی بزرگمهر')"
                >

              </button>

            `).join("")}

          </div>

        </section>


        <section class="detail">

          <span class="tag">
            ${Utils.escapeHTML(product.category || "پارچه")}
          </span>


          <h1>
            ${Utils.escapeHTML(product.name)}
          </h1>


          <div class="rating detail-rating">

            <span>
              ${Utils.stars(product.rating)}
            </span>

            <span>
              ${
                product.rating
                  ? Utils.escapeHTML(product.rating)
                  : "بدون امتیاز"
              }
            </span>

          </div>


          <div class="price-row detail-price">

            <strong class="price">
              ${
                Number(product.price) > 0
                  ? Utils.formatPrice(product.price)
                  : "تماس بگیرید"
              }
            </strong>

            ${
              Number(product.oldPrice) > 0
                ? `
                  <span class="old">
                    ${Utils.formatPrice(product.oldPrice)}
                  </span>
                `
                : ""
            }

          </div>


          ${
            Number(product.discount) > 0
              ? `
                <span class="discount-badge">
                  ${Utils.formatNumber(product.discount)}٪ تخفیف
                </span>
              `
              : ""
          }


          <p>
            ${Utils.escapeHTML(
              product.description ||
              "توضیحاتی برای این محصول ثبت نشده است."
            )}
          </p>


          <div class="specs">

            <div class="spec">
              <strong>جنس:</strong>
              ${Utils.escapeHTML(product.material || "ثبت نشده")}
            </div>

            <div class="spec">
              <strong>رنگ:</strong>
              ${Utils.escapeHTML(product.color || "ثبت نشده")}
            </div>

            <div class="spec">
              <strong>عرض:</strong>
              ${Utils.escapeHTML(product.width || "ثبت نشده")}
            </div>

            <div class="spec">
              <strong>کاربرد:</strong>
              ${Utils.escapeHTML(product.usage || "ثبت نشده")}
            </div>

          </div>


          <div class="stock ${
            inStock ? "in" : "out"
          }">

            ${
              inStock
                ? `موجودی: ${Utils.formatNumber(product.stock)}`
                : "این محصول در حال حاضر ناموجود است."
            }

          </div>


          ${
            inStock
              ? `
                <div class="qty">

                  <button
                    id="qty-minus"
                    type="button"
                  >
                    −
                  </button>

                  <strong id="qty-value">
                    ۱
                  </strong>

                  <button
                    id="qty-plus"
                    type="button"
                  >
                    +
                  </button>

                </div>
              `
              : ""
          }


          <div class="hero-actions">

            ${
              inStock
                ? `
                  <button
                    id="product-add-cart"
                    class="btn"
                  >
                    افزودن به سبد
                  </button>
                `
                : ""
            }


            <button
              id="product-wishlist"
              class="btn secondary"
            >
              ${
                favorite
                  ? "♥ حذف از علاقه‌مندی"
                  : "♡ افزودن به علاقه‌مندی"
              }
            </button>

          </div>

        </section>

      </div>

    `;


    bindProductEvents(
      product
    );

  }


  function bindProductEvents(product) {

    let quantity = 1;


    document
      .querySelectorAll(".thumb")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const image =
              button.dataset.image;

            const main =
              document.querySelector(
                "#main-product-image img"
              );

            if (main) {
              main.src = image;
            }

          }
        );

      });


    const minus =
      document.getElementById(
        "qty-minus"
      );

    const plus =
      document.getElementById(
        "qty-plus"
      );

    const quantityElement =
      document.getElementById(
        "qty-value"
      );


    if (minus) {

      minus.addEventListener(
        "click",
        () => {

          quantity =
            Math.max(1, quantity - 1);

          quantityElement.textContent =
            Utils.formatNumber(quantity);

        }
      );

    }


    if (plus) {

      plus.addEventListener(
        "click",
        () => {

          const max =
            Number(product.stock || 999999);

          quantity =
            Math.min(
              max,
              quantity + 1
            );

          quantityElement.textContent =
            Utils.formatNumber(quantity);

        }
      );

    }


    const add =
      document.getElementById(
        "product-add-cart"
      );


    if (add) {

      add.addEventListener(
        "click",
        () => {

          Cart.addToCart(
            product.id,
            quantity
          );

        }
      );

    }


    const wishlist =
      document.getElementById(
        "product-wishlist"
      );


    if (wishlist) {

      wishlist.addEventListener(
        "click",
        () => {

          const active =
            Wishlist.toggle(
              product.id
            );

          wishlist.textContent =
            active
              ? "♥ حذف از علاقه‌مندی"
              : "♡ افزودن به علاقه‌مندی";

        }
      );

    }

  }


  document.addEventListener(
    "DOMContentLoaded",
    initProductPage
  );

})();
