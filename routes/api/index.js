const router = require("express").Router();
const productRoutes = require("./products");
const accountRoutes = require("./accounts");
const uploadRoutes = require("./uploads");
const cartRoutes = require("./cart");

// api routes
router.use("/products", productRoutes);
router.use("/users", accountRoutes);
router.use("/uploads",uploadRoutes);
router.use("/cart",cartRoutes);

module.exports = router;
