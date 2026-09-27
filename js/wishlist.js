(function () {
  "use strict";

  const STORAGE_KEY =
    "nasaji_bozorgmehr_wishlist";


  function getWishlist() {

    return Utils.safeJSONParse(
      localStorage.getItem(STORAGE_KEY),
      []
    );

  }


  function saveWishlist(items) {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    );

    updateWishlistCount();

  }


  function isFavorite(productId) {

    const id = Number(productId);

    return getWishlist()
      .includes(id);

  }


  function toggle(productId) {

    const id = Number(productId);

    let items = getWishlist();

    if (items.includes(id)) {

      items = items.filter(
        item => item !== id
      );

      saveWishlist(items);

      Utils.showToast(
        "از علاقه‌مندی‌ها حذف شد."
      );

      return false;

    } else {

      items.push(id);

      saveWishlist(items);

      Utils.showToast(
        "به علاقه‌مندی‌ها اضافه شد."
      );

      return true;

    }

  }


  function updateWishlistCount() {

    const count =
      getWishlist().length;

    document
      .querySelectorAll(
        "[data-wishlist-count]"
      )
      .forEach(element => {

        element.textContent =
          Utils.formatNumber(count);

      });

  }


  window.Wishlist = {

    getWishlist,
    saveWishlist,
    isFavorite,
    toggle,
    updateWishlistCount

  };

})();
