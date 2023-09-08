const User = require("../models/User"); // Import the User model
const Product = require("../models/Product"); // Import the Product model

// Add product to cart
exports.addToCart = async (userId, productId, quantity) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { error: "User not found" };
    }

    const product = await Product.findById(productId);
    if (!product) {
      return { error: "Product not found" };
    }

    const subtotal = product.price * quantity;
    const cartItem = {
      productId,
      quantity,
      subtotal,
    };

    user.cart.push(cartItem);
    await user.save();

    return { message: "Product added to cart" };
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return { error: "An error occurred while adding product to cart" };
  }
};

// Update cart item quantity
exports.updateCartItemQuantity = async (userId, cartItemId, newQuantity) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { error: "User not found" };
    }

    // Find the cart item index in the user's cart array
    const cartItemIndex = user.cart.findIndex(
      (item) => item._id.toString() === cartItemId
    );
    if (cartItemIndex === -1) {
      return { error: "Cart item not found" };
    }

    // Update the cart item's quantity and subtotal
    const product = await Product.findById(user.cart[cartItemIndex].productId);
    if (!product) {
      return { error: "Product not found" };
    }

    const newSubtotal = product.price * newQuantity;
    user.cart[cartItemIndex].quantity = newQuantity;
    user.cart[cartItemIndex].subtotal = newSubtotal;

    await user.save();

    return { message: "Cart item quantity updated" };
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return { error: "An error occurred while updating cart item quantity" };
  }
};

// Remove product from cart
exports.removeCartItem = async (userId, cartItemId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { error: "User not found" };
    }

    // Find the cart item index in the user's cart array
    const cartItemIndex = user.cart.findIndex(
      (item) => item._id.toString() === cartItemId
    );
    if (cartItemIndex === -1) {
      return { error: "Cart item not found" };
    }

    // Remove the cart item from the user's cart array
    user.cart.splice(cartItemIndex, 1);
    await user.save();

    return { message: "Cart item removed" };
  } catch (error) {
    console.error("Error removing cart item:", error);
    return { error: "An error occurred while removing cart item" };
  }
};

// Retrieve all cart items with subtotals and total price
exports.getAllCartItems = async (userId) => {
  try {
    const user = await User.findById(userId).populate("cart.productId");

    if (!user) {
      return { error: "User not found" };
    }

    const cartItemsWithSubtotals = user.cart.map((cartItem) => {
      const product = cartItem.productId;

      return {
        productId: product._id,
        productName: product.name,
        quantity: cartItem.quantity,
        subtotal: cartItem.subtotal, // Access the subtotal from the cart item
      };
    });

    const totalPrice = cartItemsWithSubtotals.reduce(
      (total, cartItem) => total + cartItem.subtotal,
      0
    );

    return { cartItems: cartItemsWithSubtotals, totalPrice };
  } catch (error) {
    console.error("Error retrieving cart items:", error);
    return { error: "An error occurred while retrieving cart items" };
  }
};
