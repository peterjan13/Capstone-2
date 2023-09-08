const mongoose = require("mongoose");
const cart_schema = require("./Cart");

// Schema for user
const user_schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required!"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required!"],
  },
  email: {
    type: String,
    required: [true, "E-mail is required!"],
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  mobileNo: {
    type: String,
    required: [true, "Mobile Number is required!"],
  },
  cart: [cart_schema],
});

module.exports = mongoose.model("User", user_schema);
