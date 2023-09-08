const User = require("../models/User.js");
const Product = require("../models/Product.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");

// User registration
module.exports.registerUser = (request_body) => {
  let new_user = new User({
    firstName: request_body.firstName,
    lastName: request_body.lastName,
    email: request_body.email,
    mobileNo: request_body.mobileNo,
    password: bcrypt.hashSync(request_body.password, 10),
  });
  return new_user
    .save()
    .then((registered_user, error) => {
      if (error) {
        return {
          message: error.message,
        };
      }

      return {
        message: "Successfully registered a user!",
      };
    })
    .catch((error) => console.log(error));
};

// User authentication
module.exports.loginUser = (request, response) => {
	return User.findOne({email: request.body.email}).then(result => {
		// Checks if a user is found with an existing email
		if(result == null){
			return response.send({
				message: "The user isn't registered yet."
			}) 
		}

		// If a user was found with an existing email, then check if the password of that user matched the input from the request body
		const isPasswordCorrect = bcrypt.compareSync(request.body.password, result.password);

		if(isPasswordCorrect){
			// If the password comparison returns true, then respond with the newly generated JWT access token.
			return response.send({accessToken: auth.createAccessToken(result), userId: result._id});
		} else {
			return response.send({
				message: 'Your password is incorrect.'
			})
		}
	}).catch(error => response.send(error));
}

// Retrieve single user details
module.exports.getProfile = (request_body) => {
	return User.findOne({_id: request_body.id}).then((user, error) => {
		if(error){
			return {
				message: error.message 
			}
		}

		user.password = "";

		return user;
	}).catch(error => console.log(error));
}

// Set user as admin (Admin only)
module.exports.setAdmin = async (userId) => {
  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return { error: "User not found" };
    }

    // Set the user as admin
    user.isAdmin = true;
    await user.save();

    return { message: "User is now an admin" };
  } catch (error) {
    console.error("Error setting user as admin:", error);
    return { error: "An error occurred while setting user as admin" };
  }
};

// Set user as non-admin (Admin only)
module.exports.setNonAdmin = async (userId) => {
  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return { error: "User not found" };
    }

    // Set the user as non-admin
    user.isAdmin = false;
    await user.save();

    return { message: "User is now not admin" };
  } catch (error) {
    console.error("Error setting user as admin:", error);
    return { error: "An error occurred while setting user as admin" };
  }
};

// Retrieve details of all users (Admin only)
exports.getAllUsers = async (request, response) => {
  try {
    const users = await User.find({}, "-password"); // Exclude the password field
    response.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving user details:", error);
    response.status(500).json({ error: "An error occurred while retrieving user details" });
  }
};