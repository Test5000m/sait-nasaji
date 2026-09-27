(function () {
  "use strict";

  let allProducts = [];
  let filteredProducts = [];

  let currentPage = 1;

  const perPage =
    window.SITE_CONFIG.productsPerPage;


  async function initShop() {

    allProducts =
      await Products.getProducts();

    filteredProducts =
      [...allProducts];


    setupCategories();

    setupURLCategory();

    bindFilters();

    render();

  }


  function setupCategories() {

    const select =
      document.getElementById(
        "category-filter"
      );

    if (!select) {
      return;
    }

    const categories =
      Products.getCategories(
        allProducts
      );


    select.innerHTML =
      `<option value="">
        همه دسته‌بندی‌ها
      </option>` +
      categories
        .map(category => `
          <option value="${Utils.escapeHTML(category)}">
            ${Utils.escapeHTML(category)}
          </option>
        `)
        .join("");

  }


  function setupURLCategory() {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const category =
      params.get("category");


    if (!category) {
      return;
    }


    const select =
      document.getElementById(
        "category-filter"
      );


    if (select) {
      select.value = category;
    }

  }


  function bindFilters() {

    const search =
      document.getElementById(
        "shop-search"
      );

    const category =
      document.getElementById(
        "category-filter"
      );

    const min =
      document.getElementById(
        "min-price"
      );

    const max =
      document.getElementById(
        "max-price"
      );

    const sort =
      document.getElementById(
        "sort-products"
      );


    [
      search,
      category,
      min,
      max
    ].forEach(element => {

      if (!element) {
        return;
      }

      element.addEventListener(
        "input",
        applyFilters
      );

      element.addEventListener(
        "change",
        applyFilters
      );

    });


    document
      .querySelectorAll(
        'input[name="stock-filter"]'
      )
      .forEach(element => {

        element.addEventListener(
          "change",
          applyFilters
        );

      });


    if (sort) {

      sort.addEventListener(
        "change",
        applyFilters
      );

    }

  }


  function applyFilters() {

    const search =
      (
        document.getElementById(
          "shop-search"
        )?.value || ""
      )
        .trim()
        .toLowerCase();


    const category =
      document.getElementById(
        "category-filter"
      )?.value || "";


    const minPrice =
      Number(
        document.getElementById(
          "min-price"
        )?.value || 0
      );


    const maxPriceValue =
      document.getElementById(
        "max-price"
      )?.value;


    const maxPrice =
      maxPriceValue
        ? Number(maxPriceValue)
        : Infinity;


    const stock =
      document.querySelector(
        'input[name="stock-filter"]:checked'
      )?.value || "";


    filteredProducts =
      allProducts.filter(product => {

        const searchable = [

          product.name,
          product.category,
          product.material,
          product.color

        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();


        if (
          search &&
          !searchable.includes(search)
        ) {
          return false;
        }


        if (
          category &&
          product.category !== category
        ) {
          return false;
        }


        const price =
          Number(product.price || 0);


        if (
          minPrice &&
          price < minPrice
        ) {
          return false;
        }


        if (
          maxPrice !== Infinity &&
          price > maxPrice
        ) {
          return false;
        }


        const inStock =
          Number(product.stock || 0) > 0;


        if (
          stock === "in" &&
          !inStock
        ) {
          return false;
        }


        if (
          stock === "out" &&
          inStock
        ) {
          return false;
        }


        return true;

      });


    sortProducts();

    currentPage = 1;

    render();

  }


  function sortProducts() {

    const value =
      document.getElementById(
        "sort-products"
      )?.value || "default";


    if (value === "price-asc") {

      filteredProducts.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );

    }


    if (value === "price-desc") {

      filteredProducts.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );

    }


    if (value === "newest") {

      filteredProducts.sort(
        (a, b) =>
          Number(b.id || 0) -
          Number(a.id || 0)
      );

    }


    if (value === "popular") {

      filteredProducts.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );

    }

  }


  function render() {

    const container =
      document.getElementById(
        "shop-products"
      );


    const start =
      (currentPage - 1) * perPage;


    const visible =
      filteredProducts.slice(
        start,
        start + perPage
      );


    Products.renderProducts(
      visible,
      container
    );


    const count =
      document.getElementById(
        "products-count"
      );


    if (count) {

      count.textContent =
        `${Utils.formatNumber(filteredProducts.length)} محصول`;

    }


    renderPagination();

  }


  function renderPagination() {

    const container =
      document.getElementById(
        "pagination"
      );


    if (!container) {
      return;
    }


    const pages =
      Math.ceil(
        filteredProducts.length /
        perPage
      );


    if (pages <= 1) {

      container.innerHTML = "";

      return;

    }


    let html = "";


    for (
      let page = 1;
      page <= pages;
      page++
    ) {

      html += `
        <button
          class="page-btn ${
            page === currentPage
              ? "active"
              : ""
          }"
          data-page="${page}"
        >
          ${Utils.formatNumber(page)}
        </button>
      `;

    }


    container.innerHTML = html;


    container
      .querySelectorAll(
        "[data-page]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            currentPage =
              Number(button.dataset.page);

            render();

            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });

          }
        );

      });

  }


  document.addEventListener(
    "DOMContentLoaded",
    initShop
  );

})();
