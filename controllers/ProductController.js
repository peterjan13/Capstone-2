const Product = require("../models/Product.js");

// Create single product
module.exports.addProduct = (request, response) => {
  let new_product = new Product({
    name: request.body.name,
    description: request.body.description,
    price: request.body.price,
  });

  return new_product
    .save()
    .then((saved_product, error) => {
      if (error) {
        return response.send(false);
      }

      return response.send(true);
    })
    .catch((error) => response.send(error));
};

// Retrieve all products
module.exports.getAllProducts = (request, response) => {
  return Product.find({}).then((result) => {
    return response.send(result);
  });
};

// Retrieve all active products
module.exports.getAllActiveProducts = (request, response) => {
  return Product.find({ isActive: true }).then((result) => {
    return response.send(result);
  });
};

// Retrieve single product
module.exports.getProduct = (request, response) => {
  return Product.findById(request.params.id).then((result) => {
    return response.send(result);
  });
};

// Update single product information
module.exports.updateProduct = (request, response) => {
  let updated_product_details = {
    name: request.body.name,
    description: request.body.description,
    price: request.body.price,
  };
  return Product.findByIdAndUpdate(
    request.params.id,
    updated_product_details
  ).then((product, error) => {
    if (error) {
      return response.send({
        message: error.message,
      });
    }
    return response.send({
      message: "Product has been updated successfully!",
    });
  });
};

// Archive single product
module.exports.archiveProduct = (request, response) => {
  return Product.findByIdAndUpdate(request.params.id, { isActive: false }).then(
    (product, error) => {
      if (error) {
        return response.send(false);
      }
      return response.send(true);
    }
  );
};

// Activate single product
module.exports.activateProduct = (request, response) => {
  return Product.findByIdAndUpdate(request.params.id, { isActive: true }).then(
    (product, error) => {
      if (error) {
        return response.send(false);
      }

      return response.send(true);
    }
  );
};

// Search product by name
module.exports.searchProducts = (request, response) => {
  const productName = request.body.productName;
  return Product.find({ name: { $regex: productName, $options: "i" } })
    .then((products) => {
      response.send(products);
    })
    .catch((error) =>
      response.send({
        message: error.message,
      })
    );
};
