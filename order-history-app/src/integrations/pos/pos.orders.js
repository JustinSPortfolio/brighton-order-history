const { fetchPosOrders } = require("./pos.client");

async function getLatestPosOrders(since) {
  const orders = [];
  let page = 1;

  while (page) {
    const result = await fetchPosOrders(since, page);
    orders.push(...(result.orders || []));
    page = result.nextPage || null;
  }

  return orders;
}

module.exports = { getLatestPosOrders };
