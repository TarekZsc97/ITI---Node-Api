const bcrypt = require("bcrypt");
const {
  verifyTokenandAuthoraization,
  verifyTokenandAdmin,
} = require("./VerifyToken");
const User = require("../Models/User"); // Make sure you have imported your User model here

const router = require("express").Router();

router.put("/:id", verifyTokenandAuthoraization, async (req, res) => {
  // If there's a password in the request, hash it before updating the user
  if (req.body.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword; // Update the password in the request body to the hashed one
    } catch (err) {
      return res.status(500).json(err.message); // Return early in case of error
    }
  }

  try {
    // Now the req.body contains the hashed password if it was provided
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    const { password, ...others } = updatedUser._doc; // Exclude the password from the response
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err.message); // Send the error message for better debugging
  }
});
// Delete User
router.delete("/:id", verifyTokenandAuthoraization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted..");
  } catch (err) {
    res.status(500).json(err);
  }
});
// get user
router.get("/find/:id", verifyTokenandAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json({ others });
  } catch (err) {
    res.status(500).json(err);
  }
});
// get all user

// get all users - Changed the path to avoid overlap with the previous route
router.get("/findall", verifyTokenandAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get users STATS - Corrected the aggregation pipeline syntax
router.get("/stats", verifyTokenandAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: lastYear,
          },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});
// Deactivate User
router.put("/deactivate/:id", verifyTokenandAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: { isActive: false },
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json("User not found");
    }
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ...
module.exports = router;
