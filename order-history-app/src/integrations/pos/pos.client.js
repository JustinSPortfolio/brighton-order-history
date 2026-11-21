const axios = require("axios");
const { posConfig } = require("../../config/pos");

async function fetchPosOrders(updatedSince, page = 1) {
  if (!posConfig.baseUrl || !posConfig.apiToken) {
    throw new Error("POS API configuration is missing");
  }

  const response = await axios.get(`${posConfig.baseUrl}/orders`, {
    params: {
      updated_since: updatedSince.toISOString(),
      page
    },
    headers: {
      Authorization: `Bearer ${posConfig.apiToken}`
    },
    timeout: 15000
  });

  return response.data;
}

module.exports = { fetchPosOrders };
