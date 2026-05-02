// ─────────────────────────────────────────────
//  CI/CD Demo — Express REST API
// ─────────────────────────────────────────────

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// ── Routes ───────────────────────────────────

// Root endpoint – confirms the pipeline is live
app.get("/", (_req, res) => {
  res.send("CI/CD Pipeline Running");
});

// Health-check endpoint – used by Docker / orchestrators
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// ── Server Bootstrap ─────────────────────────
// Only start listening when this file is run directly (not imported by tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
}

// Export the app instance so Supertest can use it
module.exports = app;
