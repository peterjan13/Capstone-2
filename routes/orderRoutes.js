const express = require("express");
const router = express.Router();
const auth = require("../auth.js");
const OrderController = require("../controllers/OrderController.js");

// Non-admin user create order
router.post("/create-order", auth.verify, (request, response) => {
  OrderController.createOrder(request, response);
});

// Retrieve all orders (Admin only)
router.get(
  "/all-orders",
  auth.verify,
  auth.verifyAdmin,
  (request, response) => {
    OrderController.getAllOrders(request, response);
  }
);

// Retrieve all orders (Non Admin)
router.get(
  "/user-orders",
  auth.verify,
  (request, response) => {
    OrderController.getUserOrders(request, response);
  }
);

module.exports = router;