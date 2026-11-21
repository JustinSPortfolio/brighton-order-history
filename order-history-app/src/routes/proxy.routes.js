const express = require("express");
const { authenticateShopify } = require("../middleware/shopifyAuth");
const { listOrders } = require("../services/order.service");

const router = express.Router();
router.use(authenticateShopify);

router.get("/orders", async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const result = await listOrders(req.shopifyCustomerId, page, limit);

    return res.json({
      orders: result.orders,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      }
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
