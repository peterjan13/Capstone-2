const express = require("express");
const router = express.Router();
const auth = require("../auth");
const CartController = require("../controllers/CartController");

// Add product to cart
router.post(
  "/add-to-cart/:productId/:quantity",
  auth.verify,
  (request, response) => {
    CartController.addToCart(
      request.user.id,
      request.params.productId,
      parseInt(request.params.quantity)
    ).then((result) => {
      response.send(result);
    });
  }
);

// Update cart item quantity
router.put(
  "/update-cart-item/:cartItemId/:newQuantity",
  auth.verify,
  (request, response) => {
    CartController.updateCartItemQuantity(
      request.user.id,
      request.params.cartItemId,
      parseInt(request.params.newQuantity)
    ).then((result) => {
      response.send(result);
    });
  }
);

// Remove product from cart
router.delete(
  "/remove-from-cart/:cartItemId",
  auth.verify,
  (request, response) => {
    CartController.removeCartItem(
      request.user.id,
      request.params.cartItemId
    ).then((result) => {
      response.send(result);
    });
  }
);

// Retrieve all cart items with subtotals and total price
router.get("/all-cart-items", auth.verify, (request, response) => {
  CartController.getAllCartItems(request.user.id).then((cartItems) => {
    response.send(cartItems);
  });
});

module.exports = router;
