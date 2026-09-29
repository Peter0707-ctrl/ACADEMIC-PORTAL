# Universal Education Management Platform (Academic Digital OS)

An enterprise-grade, multi-tenant, country-agnostic digital operating system for educational institutions. Designed to power **Primary Schools, Secondary Schools, Advanced Secondary Schools, Vocational Institutes, Colleges, and Universities** with zero hard-coded institutional business rules.

---

## 🏗 System Architecture

The platform is designed as a high-performance **Modular Monolith** with strict service and domain boundaries:

```
ACADEMIC PORTAL/
├── apps/
│   ├── api/                   # NestJS 10 REST API (Modular Monolith)
│   └── web/                   # Next.js 14 (React 18, TypeScript, Tailwind)
├── packages/
│   └── shared/                # Enums, Granular Permissions, Role Mappings, DTOs
├── infra/
│   └── docker/
│       └── docker-compose.yml # PostgreSQL 16, Redis 7, MinIO
├── .env.example
├── package.json
└── README.md
```

---

## 🛡 First Complete Vertical Slice (Implemented & Tested)

The reference implementation workflow is fully implemented and tested across database, API, business rules, and UI:

```
Institution Setup (Kilimanjaro Secondary School)
       ↓
Academic Year (2026) & Form 1 Setup
       ↓
Subject (Physics) & Teacher Assignment (Baraka Mrema)
       ↓
Examination Creation (Term 1 Mid-Term, Status: OPEN)
       ↓
Dynamic Excel Template Generation (.xlsx pre-populated with active enrolled students)
       ↓
14-Point Server-Side Row Validation (boundary checks, unassigned teachers, student enrollment)
       ↓
Marks Submission & Edit-Locking
       ↓
Academic Master / Headmaster Approval (Triggers Grading & Standard Competition Ranking 1224)
       ↓
Scheduled / Immediate Publication Engine
       ↓
Student 360° Portal & Verified Parent Portal (with Financial Clearance Guard)
       ↓
Tamper-Resistant Audit Trail Logged
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js >= 20.x
- npm >= 10.x
- Docker & Docker Compose (or local PostgreSQL 16 & Redis 7)

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Install Dependencies & Build
```bash
npm install
npm --workspace=@academic/shared run build
npm --workspace=@academic/api run build
npm --workspace=@academic/web run build
```

### 4. Database Setup & Seeding
```bash
# Generate Prisma Client
npx prisma generate --schema=apps/api/prisma/schema.prisma

# Run Migrations against PostgreSQL
npx prisma migrate dev --schema=apps/api/prisma/schema.prisma

# Seed Demo Secondary School & Demo College
npm --workspace=@academic/api run seed
```

### 5. Start Applications
```bash
# Start NestJS API (runs on http://localhost:4000/api/v1)
# Swagger documentation available at http://localhost:4000/api/docs
npm run dev:api

# In a separate terminal, start Next.js Web App (runs on http://localhost:3000)
npm run dev:web
```

---

## 🧪 Automated Testing & Verification

The test suite covers grading calculations, tie-ranking rules, composable RBAC, and mandatory multi-tenant isolation:

```bash
npm --workspace=@academic/api run test
```

### Test Coverage Highlights:
- **`tenant-isolation.spec.ts`**: Verifies that any user from Tenant A attempting to access Tenant B's data is rejected with `403 Forbidden` (`Cross-tenant data access is strictly forbidden`).
- **`calculation-engine.spec.ts`**: Verifies boundary grading intervals and Standard Competition Ranking (`1, 2, 2, 4`) for ties.
- **`permissions-guard.spec.ts`**: Verifies granular permission enforcement and Super Admin privileges.

---

## 🔒 Security & Multi-Tenancy Non-Negotiables
1. **No Shared Identifiers:** All business entities carry an institution relationship. Unique constraints are compound (`UNIQUE(institution_id, student_number)`).
2. **Server-Side Authorization:** Zero trust in client-side claims.
3. **No Direct Mutation of Published Marks:** Published results require an audited correction workflow with before/after diffs.
4. **Financial Clearance Guard:** Where configured, students with uncleared balances cannot view official grades until clearance is granted by the Bursar.
