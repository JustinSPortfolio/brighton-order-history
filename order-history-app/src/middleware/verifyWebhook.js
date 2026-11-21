const crypto = require("crypto");
const { shopifyConfig } = require("../config/shopify");

function verifyShopifyWebhook(req) {
  const hmac = req.get("X-Shopify-Hmac-Sha256");
  if (!hmac || !Buffer.isBuffer(req.body) || !shopifyConfig.apiSecret) return false;

  const digest = crypto
    .createHmac("sha256", shopifyConfig.apiSecret)
    .update(req.body)
    .digest("base64");

  const supplied = Buffer.from(hmac);
  const expected = Buffer.from(digest);

  return supplied.length === expected.length &&
    crypto.timingSafeEqual(supplied, expected);
}

module.exports = { verifyShopifyWebhook };
