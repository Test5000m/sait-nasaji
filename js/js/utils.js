(function () {
  "use strict";

  window.Utils = {

    escapeHTML(value) {
      if (value === null || value === undefined) {
        return "";
      }

      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },


    formatPrice(value) {
      const number = Number(value);

      if (!Number.isFinite(number) || number <= 0) {
        return "تماس بگیرید";
      }

      return new Intl.NumberFormat("fa-IR").format(number) +
        " " +
        window.SITE_CONFIG.currency;
    },


    formatNumber(value) {
      const number = Number(value);

      if (!Number.isFinite(number)) {
        return "۰";
      }

      return new Intl.NumberFormat("fa-IR").format(number);
    },


    getQueryParam(name) {
      const params = new URLSearchParams(window.location.search);
      return params.get(name);
    },


    showToast(message) {

      const container =
        document.getElementById("toast-container");

      if (!container) {
        return;
      }

      const toast = document.createElement("div");

      toast.className = "toast";

      toast.textContent = message;

      container.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 2500);
    },


    safeJSONParse(value, fallback) {

      try {
        return JSON.parse(value);
      } catch (error) {
        return fallback;
      }

    },


    getPlaceholder(text = "نساجی بزرگمهر") {

      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="800"
             height="600"
             viewBox="0 0 800 600">

          <defs>
            <linearGradient id="bg"
              x1="0"
              x2="1"
              y1="0"
              y2="1">

              <stop offset="0%"
                    stop-color="#e8dccb"/>

              <stop offset="100%"
                    stop-color="#a88768"/>

            </linearGradient>
          </defs>

          <rect width="800"
                height="600"
                fill="url(#bg)"/>

          <g opacity=".18"
             stroke="#ffffff"
             stroke-width="3">

            ${Array.from(
              { length: 24 },
              (_, i) =>
                `<line x1="${i * 40}"
                       y1="0"
                       x2="${i * 40 + 300}"
                       y2="600"/>`
            ).join("")}

          </g>

          <text x="400"
                y="300"
                text-anchor="middle"
                dominant-baseline="middle"
                font-family="Arial"
                font-size="42"
                font-weight="bold"
                fill="#ffffff">
            ${text}
          </text>

        </svg>
      `;

      return "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg);
    },


    getProductImage(product, index = 0) {

      if (
        product &&
        Array.isArray(product.images) &&
        product.images[index]
      ) {
        return product.images[index];
      }

      return Utils.getPlaceholder(
        product && product.name
          ? product.name
          : "نساجی بزرگمهر"
      );
    },


    debounce(callback, delay = 250) {

      let timer;

      return function (...args) {

        clearTimeout(timer);

        timer = setTimeout(() => {
          callback.apply(this, args);
        }, delay);

      };
    },


    stars(rating) {

      const value = Number(rating) || 0;

      let output = "";

      for (let i = 1; i <= 5; i++) {
        output += i <= Math.round(value)
          ? "★"
          : "☆";
      }

      return output;
    },


    getCurrentPage() {

      const path =
        window.location.pathname
          .split("/")
          .pop();

      return path || "index.html";
    }

  };

})();
