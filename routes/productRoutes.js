const express = require("express");
const router = express.Router();
const auth = require("../auth.js");
const ProductController = require("../controllers/ProductController.js");

// Create single product
router.post("/", auth.verify, auth.verifyAdmin, (request, response) => {
  ProductController.addProduct(request, response);
});

// Retrieve all products
router.get("/all", (request, response) => {
  ProductController.getAllProducts(request, response);
});

// Retrieve all active products
router.get("/", (request, response) => {
  ProductController.getAllActiveProducts(request, response);
});

// Retrieve single product
router.get("/:id", (request, response) => {
  ProductController.getProduct(request, response);
});

// Update single product information
router.put("/:id", auth.verify, auth.verifyAdmin, (request, response) => {
  ProductController.updateProduct(request, response);
});

// Archive single product
router.put(
  "/:id/archive",
  auth.verify,
  auth.verifyAdmin,
  (request, response) => {
    ProductController.archiveProduct(request, response);
  }
);

// Activate single product
router.put(
  "/:id/activate",
  auth.verify,
  auth.verifyAdmin,
  (request, response) => {
    ProductController.activateProduct(request, response);
  }
);

// Search product by name
router.post("/search", (request, response) => {
  ProductController.searchProducts(request, response);
});

module.exports = router;
