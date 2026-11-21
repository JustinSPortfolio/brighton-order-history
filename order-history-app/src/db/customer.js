const { prisma } = require("../config/database");

async function findOrCreateCustomer(shopifyCustomerId) {
  return prisma.customer.upsert({
    where: { shopifyCustomerId },
    create: { shopifyCustomerId },
    update: {}
  });
}

module.exports = { findOrCreateCustomer };
