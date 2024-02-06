const router = require("express").Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Assuming you're using JWT for authentication
const crypto = require("crypto");

// Register
router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      address1: req.body.address1,
      address2: req.body.address2,
    });

    const savedUser = await newUser.save();

    // Generate an access token
    const accessToken = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);

    // Create the sanitized user object with the access token
    const sanitizedUser = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      isAdmin: savedUser.isAdmin,
      isVerified: savedUser.isVerified,
      address1: savedUser.address1,
      address2: savedUser.address2,
      accessToken: accessToken,
    };

    res.status(201).json(sanitizedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json("User not found");
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json("Wrong Password");
    }

    // Generate an access token
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Create the sanitized user object with the access token
    const sanitizedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      address1: user.address1,
      address2: user.address2,
      accessToken: accessToken,
    };

    res.status(200).json(sanitizedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/reset-password-request", async (req, res) => {
  try {
    if (req.body.action === "request") {
      // Password Reset Request
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const resetToken = crypto.randomBytes(20).toString("hex");
      user.resetToken = resetToken;
      user.resetTokenExpiration = Date.now() + 3600000; // Token expiration time (1 hour)
      await user.save();

      // Send an email to the user with the reset token
      // You can use a library like nodemailer to send emails

      res
        .status(200)
        .json({ message: "Password reset link sent to your email" });
    } else if (req.body.action === "reset") {
      // Password Reset
      const { resetToken, newPassword } = req.body;

      const user = await User.findOne({
        resetToken: resetToken,
        resetTokenExpiration: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      await user.save();

      res.status(200).json({ message: "Password reset successful" });
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // Token expiration time (1 hour)
    await user.save();

    // Send an email to the user with the reset token
    // You can use a library like nodemailer to send emails with the reset token

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
