const express = require("express");
const { receiveShopifyOrderWebhook } = require("../integrations/shopify/shopify.webhooks");

const router = express.Router();
router.post("/shopify/orders", receiveShopifyOrderWebhook);

module.exports = router;
