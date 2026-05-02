// ─────────────────────────────────────────────
//  Basic API Tests (Jest + Supertest)
// ─────────────────────────────────────────────

const request = require("supertest");
const app = require("./app");

describe("REST API Endpoints", () => {
  // Test the root route
  it('GET / → should return "CI/CD Pipeline Running"', async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("CI/CD Pipeline Running");
  });

  // Test the health-check route
  it("GET /health → should return JSON { status: 'ok' }", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
