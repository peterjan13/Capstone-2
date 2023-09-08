const Order = require("../models/Order.js");
const User = require("../models/User.js");
const Product = require("../models/Product");

// Non-admin user create order
exports.createOrder = async (request, response) => {
  try {
    const { userId, productId, quantity } = request.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return response.status(404).json({ error: "Product not found" });
    }

    // Calculate totalAmount based on the product price and quantity
    const totalAmount = product.price * quantity;

    // Create a new order
    const newOrder = new Order({
      userId,
      products: [
        {
          productId,
          quantity,
          name: product.name, // Include product name
          price: product.price, // Include product price
        },
      ],
      totalAmount,
    });

    // Save the order
    await newOrder.save();

    // Add the order to the product's orders array
    product.orders.push(newOrder._id);
    await product.save();

    response.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    response.status(500).json({ error: "An error occurred while creating the order" });
  }
};


// Retrieve authenticated user's orders
exports.getUserOrders = async (request, response) => {
  try {
    const userId = request.user.id; // Get the user ID from the authenticated user

    // Fetch orders for the specific user and populate products with product details
    const orders = await Order.find({ userId }).populate("products.productId");

    // Map orders to a format that includes the product name and price
    const formattedOrders = orders.map((order) => {
      return {
        _id: order._id,
        totalAmount: order.totalAmount,
        purchasedOn: order.purchasedOn,
        products: order.products.map((product) => {
          return {
            name: product.name, // Include product name
            price: product.price, // Include product price
            quantity: product.quantity,
          };
        }),
      };
    });

    response.status(200).json({ orders: formattedOrders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    response.status(500).json({ error: "An error occurred while fetching user orders" });
  }
};





// Retrieve all orders (Admin only)
exports.getAllOrders = async (request, response) => {
  try {
    // Fetch all orders, populate with user and product details
    const allOrders = await Order.find()
      .populate({
        path: "userId",
        select: "username", // Select user details you want to include
      })
      .populate({
        path: "products.productId",
        select: "name price", // Select product details you want to include
      });

    response.status(200).json({ orders: allOrders });
  } catch (error) {
    console.error("Error retrieving all orders:", error);
    response
      .status(500)
      .json({ error: "An error occurred while retrieving all orders" });
  }
};

