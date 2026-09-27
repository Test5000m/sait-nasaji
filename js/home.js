(function () {
  "use strict";

  async function initHome() {

    const products =
      await Products.getProducts();


    const categories =
      document.getElementById(
        "home-categories"
      );

    Products.renderCategories(
      products,
      categories
    );


    const featured =
      products.filter(
        product => product.featured === true
      );


    const featuredContainer =
      document.getElementById(
        "featured-products"
      );


    Products.renderProducts(
      featured.length
        ? featured.slice(0, 8)
        : products.slice(0, 8),
      featuredContainer
    );

  }


  document.addEventListener(
    "DOMContentLoaded",
    initHome
  );

})();
