# CI/CD Pipeline Demo — Node.js + Docker + GitHub Actions

A production-quality project demonstrating a **multi-stage CI/CD pipeline** using **Node.js (Express)**, **Docker**, and **GitHub Actions** — with static analysis, code coverage, security scanning, and code quality gates.

---

## 📁 Project Structure

```
ci-cd-node-docker/
├── .github/
│   └── workflows/
│       └── ci.yml              # Multi-stage GitHub Actions pipeline
├── app.js                      # Express REST API server
├── app.test.js                 # Jest + Supertest API tests
├── .eslintrc.json              # ESLint static analysis config
├── sonar-project.properties    # SonarCloud code quality config
├── Dockerfile                  # Multi-stage Docker build
├── .dockerignore               # Files excluded from Docker context
├── .gitignore                  # Files excluded from Git
├── package.json                # Project manifest & scripts
└── README.md                   # This file
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
npm test                # Run tests
npm run test:coverage   # Run tests + generate coverage report
```

### Lint Code

```bash
npm run lint       # ESLint static analysis
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

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push/PR to `main` with **5 parallel stages**:

```
┌──────────────────────────────────────────────────────┐
│                   CI/CD Pipeline                      │
├──────────────┬──────────────┬────────────────────────┤
│  🔍 Lint     │  🧪 Test     │  🛡️ Security           │
│  ESLint      │  Jest +      │  npm audit             │
│  Analysis    │  Coverage    │  Vulnerability Scan    │
├──────────────┴──────┬───────┴────────────────────────┤
│                     │                                 │
│              📊 SonarCloud (optional)                 │
│              Code Quality Gate                        │
│                     │                                 │
├─────────────────────┴─────────────────────────────────┤
│              🐳 Docker                                │
│              Hadolint Lint + Build & Tag              │
└───────────────────────────────────────────────────────┘
```

### Pipeline Stages

| # | Stage | Tool | Purpose |
|---|-------|------|---------|
| 1 | **Lint** | ESLint | Static code analysis — enforces code style & catches bugs |
| 2 | **Test** | Jest + Supertest | Unit tests with **code coverage** (80% threshold) |
| 3 | **Security** | npm audit | Scans dependencies for known vulnerabilities |
| 4 | **Quality Gate** | SonarCloud | Code quality & maintainability analysis *(optional)* |
| 5 | **Docker** | Hadolint + Docker | Dockerfile linting + multi-stage image build |

### Code Coverage

Tests generate coverage reports using Jest (equivalent to JaCoCo in Java projects). The pipeline **fails if coverage drops below 80%** on:
- Branches
- Functions
- Lines
- Statements

Coverage reports are uploaded as **GitHub Actions artifacts** and can be downloaded from the Actions tab.

---

## 🛡️ SonarCloud Setup (Optional)

To enable the SonarCloud quality gate:

1. Go to [sonarcloud.io](https://sonarcloud.io) and sign in with GitHub
2. Import this repository
3. Copy your **Organization Key** and **Project Key**
4. Update `sonar-project.properties` with those values
5. Generate a `SONAR_TOKEN` on SonarCloud
6. Add it as a GitHub secret: **Settings → Secrets → Actions → `SONAR_TOKEN`**
7. Uncomment the `sonarcloud` job in `.github/workflows/ci.yml`

---

## 🛠 Tech Stack

| Category | Tool | Equivalent In Java |
|----------|------|--------------------|
| **Runtime** | Node.js 20 | JDK |
| **Framework** | Express | Spring Boot |
| **Testing** | Jest + Supertest | JUnit + MockMVC |
| **Code Coverage** | Jest `--coverage` (lcov) | JaCoCo / PaCoCo |
| **Static Analysis** | ESLint | Checkstyle / PMD |
| **Code Quality** | SonarCloud | SonarQube |
| **Security Scan** | npm audit | OWASP Dependency-Check |
| **Container Lint** | Hadolint | — |
| **Containerization** | Docker (Alpine) | Docker |
| **CI/CD** | GitHub Actions | Jenkins / GitHub Actions |

---

## 📄 License

MIT
