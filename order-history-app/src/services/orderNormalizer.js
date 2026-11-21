function getMoney(value) {
  return value?.shopMoney?.amount ??
    value?.shop_money?.amount ??
    value?.amount ??
    value ??
    0;
}

function normalizeShopifyOrder(order) {
  const customerId = order.customer?.id;
  if (!customerId) throw new Error("Shopify order has no customer ID");

  const items = order.lineItems?.nodes || order.line_items || [];

  return {
    source: "SHOPIFY",
    externalOrderId: String(order.id),
    shopifyCustomerId: String(customerId).replace("gid://shopify/Customer/", ""),
    orderNumber: String(order.name || order.order_number || order.id),
    orderDate: new Date(order.createdAt || order.created_at),
    status: String(order.displayFinancialStatus || order.financial_status || "UNKNOWN"),
    currency: String(order.currencyCode || order.currency || "USD"),
    subtotal: Number(getMoney(order.subtotalPriceSet || order.subtotal_price_set)) || null,
    tax: Number(getMoney(order.totalTaxSet || order.total_tax_set)) || null,
    total: Number(getMoney(order.totalPriceSet || order.total_price_set)),
    items: items.map(item => ({
      sku: item.sku || item.variant?.sku || null,
      name: String(item.name || item.title || "Item"),
      quantity: Number(item.quantity || 0),
      unitPrice: Number(
        getMoney(item.originalUnitPriceSet || item.price_set || item.price)
      )
    }))
  };
}

function normalizePosOrder(order) {
  const customerId = order.shopifyCustomerId || order.customer?.shopifyCustomerId;
  if (!customerId) {
    throw new Error(`POS order ${order.id} has no verified Shopify customer mapping`);
  }

  return {
    source: "POS",
    externalOrderId: String(order.id),
    shopifyCustomerId: String(customerId),
    orderNumber: String(order.orderNumber || order.receiptNumber || order.id),
    orderDate: new Date(order.createdAt || order.orderDate),
    status: String(order.status || "COMPLETED"),
    currency: String(order.currency || "USD"),
    subtotal: order.subtotal == null ? null : Number(order.subtotal),
    tax: order.tax == null ? null : Number(order.tax),
    total: Number(order.total),
    items: (order.items || []).map(item => ({
      sku: item.sku == null ? null : String(item.sku),
      name: String(item.name || item.description || "Item"),
      quantity: Number(item.quantity || 0),
      unitPrice: Number(item.unitPrice ?? item.price ?? 0)
    }))
  };
}

module.exports = { normalizeShopifyOrder, normalizePosOrder };
