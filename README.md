# CI/CD Pipeline Demo — Node.js + Docker + GitHub Actions

A minimal, production-quality project demonstrating a complete CI/CD pipeline using **Node.js (Express)**, **Docker**, and **GitHub Actions**.

---

## 📁 Project Structure

```
ci-cd-node-docker/
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI/CD pipeline
├── app.js                  # Express REST API server
├── app.test.js             # Jest + Supertest API tests
├── Dockerfile              # Multi-stage Docker build
├── .dockerignore           # Files excluded from Docker context
├── .gitignore              # Files excluded from Git
├── package.json            # Project manifest & scripts
└── README.md               # This file
```

---

## 🚀 Quick Start

### Run Locally

```bash
npm install
npm start          # → http://localhost:3000
```

### Run Tests

```bash
npm test
```

### Build & Run with Docker

```bash
docker build -t ci-cd-node-docker .
docker run -p 3000:3000 ci-cd-node-docker
```

---

## 🔌 API Endpoints

| Method | Path      | Response                        |
| ------ | --------- | ------------------------------- |
| GET    | `/`       | `CI/CD Pipeline Running`        |
| GET    | `/health` | `{ "status": "ok" }`           |

---

## ⚙️ CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push to `main`:

1. **Checkout** — clones the repository
2. **Setup Node.js 18** — with npm cache
3. **Install dependencies** — `npm ci`
4. **Run tests** — `npm test` (Jest)
5. **Build Docker image** — `docker build`
6. **Verify image** — confirms the image exists
7. **Success** — prints confirmation

---

## 🛠 Tech Stack

- **Runtime:** Node.js 18
- **Framework:** Express
- **Testing:** Jest + Supertest
- **Containerization:** Docker (Alpine-based)
- **CI/CD:** GitHub Actions

---

## 📄 License

MIT
