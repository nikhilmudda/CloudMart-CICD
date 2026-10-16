# CloudMart-CICD

A portfolio project demonstrating an application delivery path with GitHub, Jenkins, Docker, AWS ECR, and Amazon EKS. The repository keeps application source code separate from infrastructure-as-code.

## Application

CloudMart is a minimal demo storefront with:
- Product cards and category filters
- A client-side demo shopping bag (no payment or persistence)
- A small operations dashboard
- Health and readiness endpoints
- Runtime information endpoint

## Repository layout

```text
CloudMart-CICD/
├── app/       # Node.js + Express application, frontend and Dockerfile
├── phase1/    # Existing Phase 1 Terraform infrastructure
├── phase2/    # Future infrastructure additions
├── Jenkinsfile
├── README.md
└── .gitignore
```

The `phase2/` directory and root `Jenkinsfile` will be added when their implementation is ready.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
cd app
npm install
npm start
```

Open http://localhost:3000.

Useful endpoints:
- `GET /api/health` — liveness/health check
- `GET /api/ready` — readiness check
- `GET /api/products` — product catalogue
- `GET /api/ops` — runtime information for the operations panel

Optional environment variables:

```text
PORT=3000
APP_ENV=development
APP_VERSION=1.0.0
```

## Run with Docker

From the repository root:

```bash
docker build -t cloudmart:local ./app
docker run --rm -p 3000:3000 cloudmart:local
```

Open http://localhost:3000.

## Project safety

Do not commit Terraform state, saved plans, real `terraform.tfvars`, AWS credentials, private keys, or real `.env` files. The root `.gitignore` excludes common sensitive/local artifacts. Review `git status` and `git diff --cached` before pushing to a public repository.

## Scope notes

This is a learning/demo storefront. The cart is browser-memory only; checkout, authentication, database storage and payment processing are not implemented.
