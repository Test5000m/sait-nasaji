(function () {
  "use strict";

  const STORAGE_KEY = "nasaji_bozorgmehr_cart";

  function getCart() {

    return Utils.safeJSONParse(
      localStorage.getItem(STORAGE_KEY),
      []
    );

  }


  function saveCart(cart) {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(cart)
    );

    updateCartCount();

  }


  function addToCart(productId, quantity = 1) {

    const id = Number(productId);

    if (!Number.isFinite(id)) {
      return;
    }

    const cart = getCart();

    const existing = cart.find(
      item => item.id === id
    );

    if (existing) {

      existing.quantity += quantity;

    } else {

      cart.push({
        id: id,
        quantity: quantity
      });

    }

    saveCart(cart);

    Utils.showToast(
      "محصول به سبد خرید اضافه شد."
    );

  }


  function removeFromCart(productId) {

    const id = Number(productId);

    const cart = getCart()
      .filter(item => item.id !== id);

    saveCart(cart);

  }


  function changeQuantity(productId, amount) {

    const id = Number(productId);

    const cart = getCart();

    const item = cart.find(
      item => item.id === id
    );

    if (!item) {
      return;
    }

    item.quantity += amount;

    if (item.quantity <= 0) {
      removeFromCart(id);
      return;
    }

    saveCart(cart);

  }


  function setQuantity(productId, quantity) {

    const id = Number(productId);

    const cart = getCart();

    const item = cart.find(
      item => item.id === id
    );

    if (!item) {
      return;
    }

    const newQuantity = Number(quantity);

    if (!Number.isFinite(newQuantity) ||
        newQuantity <= 0) {

      removeFromCart(id);
      return;

    }

    item.quantity = Math.floor(newQuantity);

    saveCart(cart);

  }


  function clearCart() {

    localStorage.removeItem(STORAGE_KEY);

    updateCartCount();

  }


  function getCartCount() {

    return getCart().reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );

  }


  function updateCartCount() {

    const elements =
      document.querySelectorAll(
        "[data-cart-count]"
      );

    const count = getCartCount();

    elements.forEach(element => {
      element.textContent =
        Utils.formatNumber(count);
    });

  }


  window.Cart = {

    getCart,
    saveCart,
    addToCart,
    removeFromCart,
    changeQuantity,
    setQuantity,
    clearCart,
    getCartCount,
    updateCartCount

  };

})();
