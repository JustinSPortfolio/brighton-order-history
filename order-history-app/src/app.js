const express = require("express");
const cors = require("cors");

const orderRoutes = require("./routes/order.routes");
const proxyRoutes = require("./routes/proxy.routes");
const webhookRoutes = require("./routes/webhook.routes");
const healthRoutes = require("./routes/health.routes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === "production" ? false : true
}));

// Raw body for Shopify webhook HMAC validation.
app.use("/api/webhooks", express.raw({ type: "application/json" }), webhookRoutes);
app.use(express.json());

app.use("/api/orders", orderRoutes);
app.use("/api/proxy", proxyRoutes);
app.use("/api/health", healthRoutes);
app.use(errorHandler);

module.exports = { app };
