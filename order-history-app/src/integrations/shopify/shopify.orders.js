const { fetchShopifyGraphqlOrders } = require("./shopify.client");

async function getLatestShopifyOrders(since) {
  const orders = [];
  let page = 1;

  while (page) {
    const result = await fetchShopifyGraphqlOrders(since, page);
    orders.push(...(result.orders || []));
    page = result.nextPage || null;
  }

  return orders;
}

module.exports = { getLatestShopifyOrders };