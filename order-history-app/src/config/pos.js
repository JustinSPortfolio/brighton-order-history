const posConfig = {
  baseUrl: process.env.POS_BASE_URL || "",
  apiToken: process.env.POS_API_TOKEN || "",
  pollIntervalMs: Number(process.env.POS_POLL_INTERVAL_MS || 120000)
};

module.exports = { posConfig };
