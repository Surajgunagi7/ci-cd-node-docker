// ─────────────────────────────────────────────
//  Task Manager API Tests (Jest + Supertest)
// ─────────────────────────────────────────────

const request = require("supertest");
const app = require("./app");

// Reset state before each test
beforeEach(async () => {
  await request(app).post("/reset");
});

// ── Root & Health ────────────────────────────

describe("General Endpoints", () => {
  it("GET / → should return API info with endpoints list", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Task Manager API");
    expect(res.body.status).toBe("running");
    expect(res.body.endpoints).toBeDefined();
    expect(Array.isArray(res.body.endpoints)).toBe(true);
  });

  it("GET /health → should return ok with uptime", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.uptime).toBeDefined();
    expect(res.body.timestamp).toBeDefined();
  });
});

// ── Create Tasks ─────────────────────────────

describe("POST /tasks", () => {
  it("should create a new task", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Write tests", description: "Add Jest tests" });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Write tests");
    expect(res.body.description).toBe("Add Jest tests");
    expect(res.body.status).toBe("pending");
    expect(res.body.id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  it("should create a task without description", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "No description task" });

    expect(res.statusCode).toBe(201);
    expect(res.body.description).toBe("");
  });

  it("should reject task without title", async () => {
    const res = await request(app).post("/tasks").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Title is required");
  });

  it("should reject task with empty title", async () => {
    const res = await request(app).post("/tasks").send({ title: "   " });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Title is required");
  });
});

// ── Read Tasks ───────────────────────────────

describe("GET /tasks", () => {
  it("should return empty array initially", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.tasks).toEqual([]);
  });

  it("should return all created tasks", async () => {
    await request(app).post("/tasks").send({ title: "Task 1" });
    await request(app).post("/tasks").send({ title: "Task 2" });

    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(2);
  });

  it("should filter tasks by status", async () => {
    await request(app).post("/tasks").send({ title: "Task 1" });
    const created = await request(app).post("/tasks").send({ title: "Task 2" });
    await request(app)
      .put(`/tasks/${created.body.id}`)
      .send({ status: "done" });

    const res = await request(app).get("/tasks?status=done");
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.tasks[0].status).toBe("done");
  });
});

describe("GET /tasks/:id", () => {
  it("should return a task by ID", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({ title: "Find me" });

    const res = await request(app).get(`/tasks/${created.body.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Find me");
  });

  it("should return 404 for non-existent task", async () => {
    const res = await request(app).get("/tasks/999");
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Task not found");
  });
});

// ── Update Tasks ─────────────────────────────

describe("PUT /tasks/:id", () => {
  it("should update task title", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({ title: "Old title" });

    const res = await request(app)
      .put(`/tasks/${created.body.id}`)
      .send({ title: "New title" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("New title");
  });

  it("should mark task as done", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({ title: "Complete me" });

    const res = await request(app)
      .put(`/tasks/${created.body.id}`)
      .send({ status: "done" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("done");
  });

  it("should reject invalid status", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({ title: "Bad status" });

    const res = await request(app)
      .put(`/tasks/${created.body.id}`)
      .send({ status: "invalid" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Status must be 'pending' or 'done'");
  });

  it("should return 404 for non-existent task", async () => {
    const res = await request(app)
      .put("/tasks/999")
      .send({ title: "Ghost" });

    expect(res.statusCode).toBe(404);
  });
});

// ── Delete Tasks ─────────────────────────────

describe("DELETE /tasks/:id", () => {
  it("should delete a task", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({ title: "Delete me" });

    const res = await request(app).delete(`/tasks/${created.body.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task deleted");

    // Verify it's gone
    const check = await request(app).get(`/tasks/${created.body.id}`);
    expect(check.statusCode).toBe(404);
  });

  it("should return 404 for non-existent task", async () => {
    const res = await request(app).delete("/tasks/999");
    expect(res.statusCode).toBe(404);
  });
});

// ── Stats ────────────────────────────────────

describe("GET /tasks/stats", () => {
  it("should return zeroes when empty", async () => {
    const res = await request(app).get("/tasks/stats");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      total: 0,
      pending: 0,
      done: 0,
      completionRate: 0,
    });
  });

  it("should calculate correct stats", async () => {
    const t1 = await request(app).post("/tasks").send({ title: "Task 1" });
    await request(app).post("/tasks").send({ title: "Task 2" });
    await request(app).put(`/tasks/${t1.body.id}`).send({ status: "done" });

    const res = await request(app).get("/tasks/stats");
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.pending).toBe(1);
    expect(res.body.done).toBe(1);
    expect(res.body.completionRate).toBe(50);
  });
});

// ── Reset ────────────────────────────────────

describe("POST /reset", () => {
  it("should clear all tasks", async () => {
    await request(app).post("/tasks").send({ title: "Temp" });
    const res = await request(app).post("/reset");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All tasks cleared");

    const check = await request(app).get("/tasks");
    expect(check.body.count).toBe(0);
  });
});
