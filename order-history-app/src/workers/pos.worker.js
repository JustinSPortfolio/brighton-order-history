require("dotenv").config();

const { posConfig } = require("../config/pos");
const { syncPosOrders } = require("../integrations/pos/pos.sync");

async function runSync() {
  try {
    const count = await syncPosOrders();
    console.log(`Queued ${count} POS orders`);
  } catch (error) {
    console.error("POS synchronization failed", error);
  }
}

runSync();
setInterval(runSync, posConfig.pollIntervalMs);