const {
  verifyTokenandAuthoraization,
  verifyTokenandAdmin,
} = require("./VerifyToken");
const Product = require("../Models/Product");
const router = require("express").Router();

// CREATE a new product
router.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    // Handle errors gracefully
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a product by ID
router.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: req.body },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    // Handle errors gracefully
    res.status(500).json({ error: err.message });
  }
});

// DELETE a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product has been deleted" });
  } catch (err) {
    // Handle errors gracefully
    res.status(500).json({ error: err.message });
  }
});

// GET a product by ID
router.get("/find/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const foundProduct = await Product.findById(productId);

    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(foundProduct);
  } catch (err) {
    // Handle errors gracefully
    res.status(500).json({ error: err.message });
  }
});

// GET all Products with pagination and optional category filter
router.get("/findall", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const category = req.query.category;

  try {
    let query = {};

    if (category) {
      query.category = category;
    }

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / pageSize);

    let products;
    if (page > totalPages) {
      products = [];
    } else {
      const skip = (page - 1) * pageSize;
      products = await Product.find(query).skip(skip).limit(pageSize);
    }

    res.status(200).json({
      products,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    // Handle errors gracefully
    res.status(500).json({ error: err.message });
  }
});

// GET Products by Category
router.get("/bycategory/:category", async (req, res) => {
  const category = req.params.category;

  try {
    const productsByCategory = await Product.find({ category });

    if (productsByCategory.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }

    res.status(200).json(productsByCategory);
  } catch (err) {
    // Handle errors gracefully
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
