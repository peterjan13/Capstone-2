// Server variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const port = 4000;
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/carts", cartRoutes);

// Database connection
mongoose.connect(
  `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@b303-camacho.jyiehg0.mongodb.net/b303-ecommerce-api?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.connection.on("error", () =>
  console.log("Can't connect to database.")
);
mongoose.connection.once("open", () => console.log("Connected to MongoDB!"));
app.listen(process.env.PORT || port, () => {
  console.log(
    `E-Commerce API is now runing at localhost:${process.env.PORT || port}`
  );
});

module.exports = app;
