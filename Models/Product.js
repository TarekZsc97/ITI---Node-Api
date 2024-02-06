const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
    },

    priceAfterDiscount: {
      // Assuming this is a price, the type should be Number, not Boolean
      type: Number,
      required: function () {
        return this.finalPrice && this.finalPrice > 0;
      },
    },
    finalPrice: {
      // Prices are usually stored as numbers, not strings
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
