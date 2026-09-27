(function () {
  "use strict";

  async function initCheckout() {

    const summary =
      document.getElementById(
        "checkout-summary"
      );


    const form =
      document.getElementById(
        "checkout-form"
      );


    if (!summary || !form) {
      return;
    }


    const products =
      await Products.getProducts();


    renderSummary(
      products,
      summary
    );


    form.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        const data =
          new FormData(form);


        const name =
          data.get("name");


        const phone =
          data.get("phone");


        const address =
          data.get("address");


        const result =
          document.getElementById(
            "checkout-result"
          );


        result.innerHTML = `

          <div class="success-box">

            <h2>
              سفارش شما ثبت شد
            </h2>

            <p>
              این سفارش در این نسخه فقط
              به صورت نمایشی ثبت شده است.
            </p>

            <p>
              <strong>نام:</strong>
              ${Utils.escapeHTML(name)}
            </p>

            <p>
              <strong>شماره تماس:</strong>
              ${Utils.escapeHTML(phone)}
            </p>

            <p>
              <strong>آدرس:</strong>
              ${Utils.escapeHTML(address)}
            </p>

          </div>

        `;

      }
    );

  }


  function renderSummary(
    products,
    container
  ) {

    const cart =
      Cart.getCart();


    if (!cart.length) {

      container.innerHTML = `

        <div class="empty">

          <h3>
            سبد خرید خالی است
          </h3>

          <a
            href="shop.html"
            class="btn"
          >
            مشاهده محصولات
          </a>

        </div>

      `;

      return;

    }


    let total = 0;


    const rows =
      cart.map(item => {

        const product =
          products.find(
            p =>
              Number(p.id) ===
              Number(item.id)
          );


        if (!product) {
          return "";
        }


        const price =
          Number(product.price || 0);


        const subtotal =
          price *
          Number(item.quantity || 0);


        total += subtotal;


        return `

          <div class="summary-row">

            <span>
              ${Utils.escapeHTML(product.name)}
              ×
              ${Utils.formatNumber(item.quantity)}
            </span>

            <strong>
              ${Utils.formatPrice(subtotal)}
            </strong>

          </div>

        `;

      }).join("");


    container.innerHTML = `

      <h2>
        خلاصه سفارش
      </h2>

      ${rows}

      <hr>

      <div class="summary-total">

        <span>
          جمع کل
        </span>

        <strong>
          ${Utils.formatPrice(total)}
        </strong>

      </div>

    `;

  }


  document.addEventListener(
    "DOMContentLoaded",
    initCheckout
  );

})();
