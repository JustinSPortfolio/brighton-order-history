const axios = require("axios");
const { shopifyConfig, assertShopifyConfig } = require("../../config/shopify");

async function fetchShopifyGraphqlOrders(query, variables = {}) {
  assertShopifyConfig();

  const response = await axios.post(
    shopifyConfig.shopUrl,
    { query, variables },
    {
      headers: {
        "X-Shopify-Access-Token": shopifyConfig.adminAccessToken,
        "Content-Type": "application/json"
      },
      timeout: 15000
    }
  );

  if (response.data.errors?.length) {
    throw new Error(`Shopify GraphQL errors: ${JSON.stringify(response.data.errors)}`);
  }

  return response.data.data;
}

module.exports = { fetchShopifyGraphqlOrders };
