const express = require("express");
const mongoose = require("mongoose"); // corrected the typo here
const dotenv = require("dotenv"); // changed 'env' to 'dotenv' to match the package name
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const couponRoute = require("./routes/coupon");
const categoryRoute = require("./routes/category1");
const app = express();
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/coupons", couponRoute);
app.use("/api/order", orderRoute);
app.use("/api/category1", categoryRoute);

app.listen(3000, () => {
  console.log("E-Commerce is running");
});
