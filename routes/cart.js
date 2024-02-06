const {
  verifyTokenandAuthoraization,
  verifyTokenandAdmin,
  VerifyToken,
} = require("./VerifyToken");
const Cart = require("../Models/Cart");
const router = require("express").Router();
const Coupon = require("../Models/Coupon");
// CREATE
router.post("/", async (req, res) => {
  const newCart = new Cart(req.body); // Change 'cart' to 'Cart' for consistency
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update Cart
router.put("/:id", async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err.message); // Send the error message for better debugging
  }
});

// Delete Cart
router.delete("/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted."); // Corrected the response message
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Cart by userId
router.get("/find/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all Carts
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/apply-coupon/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;
    const { couponCode } = req.body;
    // Find the cart by ID
    const cart = await Cart.findById(cartId);
    console.log(cart);
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Find the coupon by code
    const coupon = await Coupon.findOne({ couponCode });

    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    }

    // Check if the coupon has been applied to any product in the cart
    const couponAppliedToProducts = cart.products.some(
      (product) => product.couponApplied
    );

    if (couponAppliedToProducts) {
      return res.status(400).json({
        success: false,
        message: "Coupon already applied to products",
      });
    }

    // Check if cart.totalPrice and coupon.value are valid numbers
    console.log(coupon.value);
    if (isNaN(cart.totalPrice) || isNaN(coupon.value)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart or coupon values",
      });
    }

    // Calculate the price after discount and apply the coupon to the cart
    cart.couponApplied = true;
    console.log(cart.priceAfterDiscount);
    cart.priceAfterDiscount = cart.priceAfterDiscount - coupon.value;
    console.log(cart.priceAfterDiscount);
    console.log(cart.totalPrice);
    cart.save();

    res
      .status(200)
      .json({ success: true, message: "Coupon applied to the cart", cart });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
