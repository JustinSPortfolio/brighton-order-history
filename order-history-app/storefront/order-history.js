(() => {
  const root = document.querySelector("[data-order-history]");
  if (!root) return;

  const list = root.querySelector("[data-orders]");
  const status = root.querySelector("[data-status]");
  const pageLabel = root.querySelector("[data-page]");
  const prev = root.querySelector("[data-prev]");
  const next = root.querySelector("[data-next]");

  // Must match the prefix configured for the Shopify App Proxy.
  const endpoint = "/apps/order-history/orders";
  let page = 1;
  let totalPages = 1;

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function render(orders) {
    if (!orders.length) {
      list.innerHTML = "";
      status.textContent = "You don't have any orders yet.";
      return;
    }

    status.textContent = "";
    list.innerHTML = orders.map(order => `
      <article class="order-card">
        <div class="order-card__heading">
          <strong>Order #${escapeHtml(order.orderNumber)}</strong>
          <span>${escapeHtml(order.source)}</span>
        </div>
        <p>${new Date(order.orderDate).toLocaleDateString()}</p>
        <p>${escapeHtml(order.status)}</p>
        <strong>${escapeHtml(order.currency)} ${Number(order.total).toFixed(2)}</strong>
      </article>
    `).join("");
  }

  async function loadOrders() {
    status.textContent = "Loading orders…";
    list.innerHTML = "";

    try {
      const response = await fetch(`${endpoint}?page=${page}&limit=20`, {
        credentials: "same-origin",
        headers: { Accept: "application/json" }
      });

      if (response.status === 401) {
        status.textContent = "Please sign in to view your orders.";
        return;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      totalPages = data.pagination?.totalPages || 1;
      render(data.orders || []);

      pageLabel.textContent = `Page ${page} of ${totalPages}`;
      prev.disabled = page <= 1;
      next.disabled = page >= totalPages;
    } catch (error) {
      console.error(error);
      status.textContent = "We couldn't load your orders. Please try again.";
    }
  }

  prev.addEventListener("click", () => {
    if (page > 1) {
      page -= 1;
      loadOrders();
    }
  });

  next.addEventListener("click", () => {
    if (page < totalPages) {
      page += 1;
      loadOrders();
    }
  });

  loadOrders();
})();
