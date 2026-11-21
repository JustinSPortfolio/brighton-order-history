const { prisma } = require("../config/database");
const { findOrCreateCustomer } = require("./customer");

async function saveOrder(order) {
  const customer = await findOrCreateCustomer(order.shopifyCustomerId);

  return prisma.order.upsert({
    where: {
      source_externalOrderId: {
        source: order.source,
        externalOrderId: order.externalOrderId
      }
    },
    create: {
      customerId: customer.id,
      source: order.source,
      externalOrderId: order.externalOrderId,
      orderNumber: order.orderNumber,
      orderDate: order.orderDate,
      status: order.status,
      currency: order.currency,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      items: order.items
    },
    update: {
      customerId: customer.id,
      orderNumber: order.orderNumber,
      orderDate: order.orderDate,
      status: order.status,
      currency: order.currency,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      items: order.items
    }
  });
}

async function getCustomerOrders(customerId, page = 1, limit = 20) {
  const where = { customer: { shopifyCustomerId: customerId } };

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      orderBy: { orderDate: "desc" },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.order.count({ where })
  ]);

  return { orders, total, page, limit };
}

async function getCustomerOrderById(customerId, orderId) {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      customer: { shopifyCustomerId: customerId }
    }
  });
}

module.exports = { saveOrder, getCustomerOrders, getCustomerOrderById };
