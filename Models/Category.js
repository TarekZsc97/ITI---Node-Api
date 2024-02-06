const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    categoryName: {
      type: String,

      trim: true, // Removes whitespace from both ends of the string
    },
    image: {
      type: String,
      // Assuming every category must have an image
      // You could also validate the image URL format if necessary
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // This should match the name you used when you created the User model
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
