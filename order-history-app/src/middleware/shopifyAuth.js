const crypto = require("crypto");
const { shopifyConfig } = require("../config/shopify");

function verifyAppProxyRequest(originalUrl) {
  if (!shopifyConfig.apiSecret) return null;

  const url = new URL(originalUrl, "http://localhost");
  const params = new URLSearchParams(url.search);
  const signature = params.get("signature");
  if (!signature) return null;

  params.delete("signature");
  const entries = [...params.entries()].sort(([a], [b]) => a.localeCompare(b));
  const message = entries.map(([key, value]) => `${key}=${value}`).join("");

  const expected = crypto
    .createHmac("sha256", shopifyConfig.apiSecret)
    .update(message)
    .digest("hex");

  const suppliedBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) return null;

  const customerId = params.get("logged_in_customer_id");
  return customerId && /^\\d+$/.test(customerId) ? customerId : null;
}

function authenticateShopify(req, res, next) {

  const customerId = verifyAppProxyRequest(req.originalUrl);
  if (!customerId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  req.shopifyCustomerId = customerId;
  return next();
}

module.exports = { authenticateShopify, verifyAppProxyRequest };
