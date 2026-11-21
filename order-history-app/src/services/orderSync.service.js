const { saveOrder } = require("../db/order");

async function persistNormalizedOrder(order) {
  if (!order.externalOrderId || !order.shopifyCustomerId) {
    throw new Error("Order is missing required identifiers");
  }
  if (Number.isNaN(order.orderDate.getTime())) {
    throw new Error("Order has an invalid order date");
  }
  if (!Number.isFinite(order.total)) {
    throw new Error("Order has an invalid total");
  }

  return saveOrder(order);
}

module.exports = { persistNormalizedOrder };
