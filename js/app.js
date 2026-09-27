(function () {
  "use strict";


  function renderHeader() {

    const container =
      document.getElementById(
        "site-header"
      );


    if (!container) {
      return;
    }


    const current =
      Utils.getCurrentPage();


    container.innerHTML = `

      <div class="topbar">

        <div class="container">

          <span>
            نساجی بزرگمهر
          </span>

          <a href="tel:${SITE_CONFIG.phone}">
            ${SITE_CONFIG.phone}
          </a>

        </div>

      </div>


      <header class="header">

        <div class="container nav">


          <a
            href="index.html"
            class="brand"
          >

            <span class="brand-mark">
              ب
            </span>

            <span>
              <strong>
                نساجی بزرگمهر
              </strong>

              <small>
                فروشگاه پارچه در اصفهان
              </small>
            </span>

          </a>


          <nav
            id="main-navigation"
            class="links"
          >

            <a
              href="index.html"
              class="${
                current === "index.html"
                  ? "active"
                  : ""
              }"
            >
              خانه
            </a>

            <a
              href="shop.html"
              class="${
                current === "shop.html"
                  ? "active"
                  : ""
              }"
            >
              فروشگاه
            </a>

            <a href="shop.html">
              دسته‌بندی‌ها
            </a>

            <a
              href="about.html"
              class="${
                current === "about.html"
                  ? "active"
                  : ""
              }"
            >
              درباره ما
            </a>

            <a
              href="contact.html"
              class="${
                current === "contact.html"
                  ? "active"
                  : ""
              }"
            >
              تماس با ما
            </a>

          </nav>


          <div class="actions">

            <a
              class="icon-btn"
              href="shop.html"
              aria-label="جستجو"
            >
              ⌕
            </a>


            <a
              class="icon-btn"
              href="wishlist.html"
              aria-label="علاقه‌مندی‌ها"
            >
              ♡

              <span
                class="count"
                data-wishlist-count
              >
                ۰
              </span>

            </a>


            <a
              class="icon-btn"
              href="cart.html"
              aria-label="سبد خرید"
            >
              🛒

              <span
                class="count"
                data-cart-count
              >
                ۰
              </span>

            </a>


            <button
              id="mobile-menu-button"
              class="icon-btn menu-btn"
              aria-label="منو"
            >
              ☰
            </button>

          </div>

        </div>

      </header>

    `;


    const menuButton =
      document.getElementById(
        "mobile-menu-button"
      );


    const navigation =
      document.getElementById(
        "main-navigation"
      );


    if (
      menuButton &&
      navigation
    ) {

      menuButton.addEventListener(
        "click",
        () => {

          navigation.classList.toggle(
            "open"
          );

        }
      );

    }

  }


  function renderFooter() {

    const container =
      document.getElementById(
        "site-footer"
      );


    if (!container) {
      return;
    }


    container.innerHTML = `

      <footer class="footer">

        <div class="container">

          <div class="footer-grid">

            <div>

              <div class="brand footer-brand">

                <span class="brand-mark">
                  ب
                </span>

                <span>
                  <strong>
                    نساجی بزرگمهر
                  </strong>

                  <small>
                    فروشگاه پارچه در اصفهان
                  </small>
                </span>

              </div>

              <p>
                معرفی و ارائه محصولات پارچه
                با تجربه‌ای ساده و حرفه‌ای.
              </p>

            </div>


            <div>

              <h3>
                دسترسی سریع
              </h3>

              <p>
                <a href="index.html">
                  خانه
                </a>
              </p>

              <p>
                <a href="shop.html">
                  فروشگاه
                </a>
              </p>

              <p>
                <a href="about.html">
                  درباره ما
                </a>
              </p>

              <p>
                <a href="contact.html">
                  تماس با ما
                </a>
              </p>

            </div>


            <div>

              <h3>
                ارتباط با ما
              </h3>

              <p>
                ${SITE_CONFIG.address}
              </p>

              <p>
                <a
                  href="tel:${SITE_CONFIG.phone}"
                >
                  ${SITE_CONFIG.phone}
                </a>
              </p>

              <p>
                <a
                  id="footer-map-link"
                  href="#"
                  target="_blank"
                  rel="noopener"
                >
                  مسیریابی
                </a>
              </p>

            </div>

          </div>


          <div class="footer-bottom">

            © ${new Date().getFullYear()}
            نساجی بزرگمهر

          </div>

        </div>

      </footer>

    `;


    const footerMap =
      document.getElementById(
        "footer-map-link"
      );


    if (
      footerMap &&
      SITE_CONFIG.mapUrl
    ) {

      footerMap.href =
        SITE_CONFIG.mapUrl;

    }

  }


  function setupMapLinks() {

    const links =
      document.querySelectorAll(
        "#map-link, #directions-link"
      );


    links.forEach(link => {

      if (
        SITE_CONFIG.mapUrl
      ) {

        link.href =
          SITE_CONFIG.mapUrl;

        link.removeAttribute(
          "aria-disabled"
        );

      } else {

        link.href = "#";

        link.addEventListener(
          "click",
          event => {

            event.preventDefault();

            Utils.showToast(
              "لینک نقشه هنوز در config.js وارد نشده است."
            );

          }
        );

      }

    });

  }


  function bindGlobalEvents() {

    document.addEventListener(
      "click",
      event => {

        const cartButton =
          event.target.closest(
            "[data-add-cart]"
          );


        if (cartButton) {

          const id =
            cartButton.dataset.addCart;

          Cart.addToCart(id);

          return;

        }


        const wishlistButton =
          event.target.closest(
            "[data-wishlist]"
          );


        if (wishlistButton) {

          const id =
            wishlistButton.dataset.wishlist;

          const active =
            Wishlist.toggle(id);


          wishlistButton.textContent =
            active
              ? "♥"
              : "♡";


          wishlistButton.classList.toggle(
            "active",
            active
          );

        }

      }
    );

  }


  document.addEventListener(
    "DOMContentLoaded",
    () => {

      renderHeader();

      renderFooter();

      setupMapLinks();

      bindGlobalEvents();

      Cart.updateCartCount();

      Wishlist.updateWishlistCount();

    }
  );

})();
