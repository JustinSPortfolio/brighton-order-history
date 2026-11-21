const express = require("express");
const { prisma } = require("../config/database");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ status: "ok", database: "connected" });
  } catch (error) {
    return res.status(503).json({ status: "error", database: "unavailable" });
  }
});

module.exports = router;
