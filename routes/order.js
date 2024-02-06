const {
  verifyTokenandAuthoraization,
  verifyTokenandAdmin,
  VerifyToken,
} = require("./VerifyToken");
const order = require("../Models/Order");

const router = require("express").Router();

// CREATE //
router.post("/", VerifyToken, async (req, res) => {
  const newOrder = new cart(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", verifyTokenandAdmin, async (req, res) => {
  // If there's a password in the request, hash it before updating the user

  try {
    // Now the req.body contains the hashed password if it was provided
    const updateOrder = await product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updateOrder);
  } catch (err) {
    res.status(500).json(err.message); // Send the error message for better debugging
  }
});
// Delete Order
router.delete("/:id", verifyTokenandAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted..");
  } catch (err) {
    res.status(500).json(err);
  }
});
// Get USER Order
router.get("/find/:userId", verifyTokenandAuthoraization, async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.userId });

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all Orders
router.get("/", verifyTokenandAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
