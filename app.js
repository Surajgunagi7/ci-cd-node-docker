// ─────────────────────────────────────────────
//  CI/CD Demo — Task Manager REST API
//  In-memory storage (no database required)
// ─────────────────────────────────────────────

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────
app.use(express.json());

// ── In-Memory Data Store ─────────────────────
let tasks = [];
let nextId = 1;

// ── Helper ───────────────────────────────────
const findTask = (id) => tasks.find((t) => t.id === id);

const timestamp = () => new Date().toISOString();

// ── Routes ───────────────────────────────────

// Root — confirms the pipeline is live
app.get("/", (_req, res) => {
  res.json({
    name: "Task Manager API",
    version: "1.0.0",
    status: "running",
    endpoints: [
      "GET    /health",
      "GET    /tasks",
      "GET    /tasks/:id",
      "POST   /tasks",
      "PUT    /tasks/:id",
      "DELETE /tasks/:id",
      "GET    /tasks/stats",
    ],
  });
});

// Health-check — used by Docker / orchestrators
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: timestamp(),
  });
});

// ── Task CRUD ────────────────────────────────

// List all tasks (with optional status filter)
app.get("/tasks", (req, res) => {
  const { status } = req.query;
  let result = tasks;

  if (status) {
    result = tasks.filter((t) => t.status === status);
  }

  res.json({ count: result.length, tasks: result });
});

// Get task stats
app.get("/tasks/stats", (_req, res) => {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const done = tasks.filter((t) => t.status === "done").length;

  res.json({
    total,
    pending,
    done,
    completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
  });
});

// Get a single task by ID
app.get("/tasks/:id", (req, res) => {
  const task = findTask(Number(req.params.id));

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json(task);
});

// Create a new task
app.post("/tasks", (req, res) => {
  const { title, description } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    description: description ? description.trim() : "",
    status: "pending",
    createdAt: timestamp(),
    updatedAt: timestamp(),
  };

  tasks.push(task);
  res.status(201).json(task);
});

// Update a task
app.put("/tasks/:id", (req, res) => {
  const task = findTask(Number(req.params.id));

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const { title, description, status } = req.body;

  if (status && !["pending", "done"].includes(status)) {
    return res.status(400).json({ error: "Status must be 'pending' or 'done'" });
  }

  if (title !== undefined) {
    task.title = title.trim();
  }
  if (description !== undefined) {
    task.description = description.trim();
  }
  if (status !== undefined) {
    task.status = status;
  }

  task.updatedAt = timestamp();
  res.json(task);
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const index = tasks.findIndex((t) => t.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const deleted = tasks.splice(index, 1)[0];
  res.json({ message: "Task deleted", task: deleted });
});

// ── Reset (useful for testing) ───────────────
app.post("/reset", (_req, res) => {
  tasks = [];
  nextId = 1;
  res.json({ message: "All tasks cleared" });
});

// ── Server Bootstrap ─────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Task Manager API running on http://localhost:${PORT}`);
  });
}

module.exports = app;
