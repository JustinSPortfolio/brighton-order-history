const { getCustomerOrders, getCustomerOrderById } = require("../db/order");

async function listOrders(customerId, page, limit) {
  return getCustomerOrders(customerId, page, limit);
}

async function getOrder(customerId, orderId) {
  return getCustomerOrderById(customerId, orderId);
}

module.exports = { listOrders, getOrder };
