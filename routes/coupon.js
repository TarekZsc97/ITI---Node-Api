const Product = require("../Models/Product");
const express = require("express");
const Coupon = require("../Models/Coupon");

const {
  verifyTokenandAuthoraization,
  verifyTokenandAdmin,
} = require("./VerifyToken");
const router = express.Router();

// CREATE a Coupon
router.post("/add-coupon", async (req, res) => {
  const newCoupon = new Coupon(req.body);
  try {
    const savedCoupon = await newCoupon.save();
    res.status(200).json(savedCoupon);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a Coupon by ID
router.put("/update-coupon/:id", async (req, res) => {
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedCoupon);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Delete a Coupon by ID
router.delete("/delete-coupon/:id", async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json("Coupon has been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all Coupons
router.get("/get-all-coupons", async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ...

router.post("/apply-coupon-to-product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { couponCode } = req.body;

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Find the coupon by code
    const coupon = await Coupon.findOne({ couponCode });
    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    }

    // Check if the coupon is valid for this product and apply the discount if applicable
    if (product.price >= coupon.value) {
      product.price -= coupon.value; // Subtract the coupon value from the product price
      await product.save(); // Save the updated product price
      res
        .status(200)
        .json({ success: true, message: "Coupon applied successfully" });
    } else {
      res.status(400).json({
        success: false,
        message: "Coupon value is greater than product price",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// ...

module.exports = router;
