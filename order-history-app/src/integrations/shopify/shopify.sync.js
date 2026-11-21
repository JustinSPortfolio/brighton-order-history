const { prisma } = require("../../config/database");
const { getLatestShopifyOrders } = require("./shopify.orders");
const { normalizeShopifyOrder } = require("../../services/orderNormalizer");
const { persistNormalizedOrder } = require("../../services/orderSync.service");

const CURSOR_KEY = "shopify:last-used-sync";

async function syncShopifyOrders() {
  const state = await prisma.syncState.findUnique({
    where: { key: CURSOR_KEY }
  });

  const lastRun = state?.value
    ? new Date(state.value)
    : new Date(Date.now() - 24 * 60 * 60 * 1000);


  const since = new Date(lastRun.getTime() - 60 * 1000);
  const orders = await getLatestShopifyOrders(since);

  let idx = 0;

  while (idx < orders.length) {
    let dbOrder = normalizeShopifyOrder(orders[idx]);
    persistNormalizedOrder(dbOrder);
    idx++;
  }


  const now = new Date().toISOString();

  await prisma.syncState.upsert({
    where: { key: CURSOR_KEY },
    create: { key: CURSOR_KEY, value: now },
    update: { value: now }
  });

}

module.exports = { syncShopifyOrders };