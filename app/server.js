const express = require("express");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const startedAt = new Date();

app.disable("x-powered-by");
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const products = [
  { id: "CM-101", name: "Everyday Tote", category: "Accessories", price: 24.99, stock: 18, emoji: "👜" },
  { id: "CM-102", name: "Studio Bottle", category: "Lifestyle", price: 18.50, stock: 42, emoji: "🥤" },
  { id: "CM-103", name: "Desk Companion", category: "Workspace", price: 32.00, stock: 9, emoji: "🪴" },
  { id: "CM-104", name: "Cloud Hoodie", category: "Apparel", price: 48.00, stock: 15, emoji: "👕" },
  { id: "CM-105", name: "Daily Notebook", category: "Stationery", price: 12.75, stock: 64, emoji: "📓" },
  { id: "CM-106", name: "Wireless Mini", category: "Electronics", price: 59.00, stock: 7, emoji: "🎧" }
];

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "cloudmart",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

app.get("/api/ready", (_req, res) => {
  res.status(200).json({ status: "ready" });
});

app.get("/api/products", (_req, res) => {
  res.json(products);
});

app.get("/api/ops", (_req, res) => {
  res.json({
    service: "CloudMart Web",
    environment: process.env.APP_ENV || "development",
    version: process.env.APP_VERSION || "1.0.0",
    status: "Operational",
    uptimeSeconds: Math.floor(process.uptime()),
    startedAt: startedAt.toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    memory: process.memoryUsage()
  });
});

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CloudMart listening on port ${PORT}`);
});
