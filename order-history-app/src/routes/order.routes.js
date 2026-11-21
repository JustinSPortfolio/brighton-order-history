const express = require("express");
const { authenticateShopify } = require("../middleware/shopifyAuth");
const { listOrders, getOrder } = require("../services/order.service");

const router = express.Router();
router.use(authenticateShopify);

router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const result = await listOrders(req.shopifyCustomerId, page, limit);

    return res.json({
      orders: result.orders,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit)
      }
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const order = await getOrder(req.shopifyCustomerId, req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    return res.json({ order });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
