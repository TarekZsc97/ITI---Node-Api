const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponSchema = new Schema(
  {
    couponCode: {
      type: String,

      trim: true,
    },
    value: {
      type: Number,

      min: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    expireIn: {
      type: Date,

      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
