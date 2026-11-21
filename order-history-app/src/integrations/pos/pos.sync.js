const { prisma } = require("../../config/database");
const { getLatestPosOrders } = require("./pos.orders");
const { normalizePosOrder } = require("../../services/orderNormalizer");
const { persistNormalizedOrder } = require("../../services/orderSync.service");

const CURSOR_KEY = "pos:last-used-sync";

async function syncPosOrders() {
  const state = await prisma.syncState.findUnique({
    where: { key: CURSOR_KEY }
  });

  const lastRun = state?.value
    ? new Date(state.value)
    : new Date(Date.now() - 24 * 60 * 60 * 1000);


  const since = new Date(lastRun.getTime() - 60 * 1000);
  const orders = await getLatestPosOrders(since);

  let idx = 0;

  while (idx < orders.length) {
    let dbOrder = normalizePosOrder(orders[idx]);
    persistNormalizedOrder(dbOrder);
    idx++;
  }

  const now = new Date().toISOString();

  await prisma.syncState.upsert({
    where: { key: CURSOR_KEY },
    create: { key: CURSOR_KEY, value: now },
    update: { value: now }
  });

  return orders.length;
}

module.exports = { syncPosOrders };
