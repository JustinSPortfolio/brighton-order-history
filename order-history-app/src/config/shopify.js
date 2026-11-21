const shopifyConfig = {
  shopDomain: process.env.SHOPIFY_SHOP_DOMAIN || "",
  adminAccessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "",
  apiSecret: process.env.SHOPIFY_API_SECRET || "",
  shopUrl: process.env.SHOPIFY_URL || ""
};

function assertShopifyConfig() {
  const missing = Object.entries(shopifyConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(`Missing Shopify configuration: ${missing.join(", ")}`);
  }
}

module.exports = { shopifyConfig, assertShopifyConfig };
