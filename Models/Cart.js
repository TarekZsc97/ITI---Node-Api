const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Replace 'User' with the model name you've used for the user schema
    },
    totalPrice: {
      type: Number,

      min: 0, // Assuming the total price cannot be negative
    },
    priceAfterDiscount: {
      type: Number,
      min: 0, // Assuming the price after discount cannot be negative
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product", // Replace 'Product' with the model name you've used for the product schema
        },
        quantity: {
          type: Number,

          min: 1, // Assuming you cannot have less than 1 of an item
          default: 1,
        },
        price: {
          type: Number,
        },
        discount: {
          type: Number,

          default: 0, // Assuming there might not be a discount on every product
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
