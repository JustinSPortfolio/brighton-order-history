const { verifyShopifyWebhook } = require("../../middleware/verifyWebhook");
const { syncShopifyOrders } = require("./shopify.sync");

async function receiveShopifyOrderWebhook(req, res, next) {
  try {
    if (!verifyShopifyWebhook(req)) {
      return res.status(401).json({ error: "Invalid webhook signature" });
    }

    await syncShopifyOrders()

    return res.status(200).send("Accepted");
  } catch (error) {
    return next(error);
  }
}

module.exports = { receiveShopifyOrderWebhook };
