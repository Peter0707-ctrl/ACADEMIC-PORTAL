# 🚀 MWONGOZO WA KUSAMBAZA (DEPLOYMENT) KWENYE RAILWAY
## Academic Portal — Production Deployment & Security Guide

Huu ni mwongozo wa hatua kwa hatua wa kusambaza mfumo wa **Academic Portal** kwenye jukwaa la wingu la **Railway** (PaaS).

---

## 1. Muundo wa Mfumo kwenye Railway (Architecture)

Katika mradi wa Railway (**Railway Project**), utaweka huduma (services) 4:
1. **PostgreSQL Database** (Plugin ya Railway — inatoa `DATABASE_URL` moja kwa moja)
2. **Redis** (Plugin ya Railway — inatoa `REDIS_URL` moja kwa moja)
3. **Backend API Service** (`@academic/api` — NestJS REST API, Dockerfile.api)
4. **Frontend Web Service** (`@academic/web` — Next.js 14, Dockerfile.web)

---

## 2. Hatua ya Kwanza: Kuandaa Database na Redis kwenye Railway

1. Ingia kwenye akaunti yako ya [Railway.app](https://railway.app).
2. Bonyeza **New Project** -> Chagua **Provision PostgreSQL**.
3. Bonyeza **+ New** ndani ya mradi huo huo -> Chagua **Database** -> **Add Redis**.
4. Railway itatengeneza Database na kutoa `DATABASE_URL` pamoja na `REDIS_URL` kiotomatiki.

---

## 3. Hatua ya Pili: Kusambaza Backend API (`@academic/api`)

1. Ndani ya Mradi wa Railway, bonyeza **+ New** -> **GitHub Repo** -> Chagua `ACADEMIC-PORTAL`.
2. Badili jina la Service liwe `academic-api`.
3. Nenda **Settings** -> **Build & Deploy**:
   - **Build**: Chagua **Dockerfile**
   - **Dockerfile Path**: `Dockerfile.api`
4. Nenda **Settings** -> **Networking**:
   - Bonyeza **Generate Domain** (utapata domain kama `academic-api-production.up.railway.app`)
5. Nenda **Variables** (Environment Variables) na weka zifuatazo:

| Variable Name | Thamani Inayopendekezwa | Maelezo |
|---|---|---|
| `NODE_ENV` | `production` | Lazima iwe production |
| `PORT` | `4000` | Railway itapitisha port kiotomatiki |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Unganisha na PostgreSQL ya Railway |
| `REDIS_HOST` | `${{Redis.REDISHOST}}` | Unganisha na Redis ya Railway |
| `REDIS_PORT` | `${{Redis.REDISPORT}}` | Port ya Redis |
| `REDIS_PASSWORD` | `${{Redis.REDISPASSWORD}}` | Nywila ya Redis |
| `JWT_SECRET` | *Weka random 64-char string* | `openssl rand -base64 48` |
| `JWT_EXPIRATION` | `24h` | Muda wa token |
| `CORS_ORIGIN` | `https://academic-web-production.up.railway.app` | Domain ya Frontend yako |
| `ENABLE_SWAGGER` | `false` (au `true` kama unataka API docs) | Usalama wa nyaraka |

6. **Health Check**:
   - Nenda **Settings** -> **Healthcheck Path**: `/api/v1/health`

---

## 4. Hatua ya Tatu: Kuendesha Migrations za Database

Mara baada ya API kuunganishwa na database, endesha migrations kuunda tables:
- **Kupitia Railway CLI**:
  ```bash
  railway run npm run prisma:deploy
  ```
- **Au kupitia Railway Service Settings** (Deploy Command / Post-deploy):
  ```bash
  npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma
  ```

---

## 5. Hatua ya Nne: Kusambaza Frontend Web (`@academic/web`)

1. Ndani ya Mradi huo huo wa Railway, bonyeza **+ New** -> **GitHub Repo** -> Chagua tena `ACADEMIC-PORTAL`.
2. Badili jina la Service liwe `academic-web`.
3. Nenda **Settings** -> **Build & Deploy**:
   - **Build**: Chagua **Dockerfile**
   - **Dockerfile Path**: `Dockerfile.web`
4. Nenda **Settings** -> **Networking**:
   - Bonyeza **Generate Domain** (utapata domain kama `academic-web-production.up.railway.app` au unganisha domain yako rasmi ya `.ac.tz` au `.com`).
5. Nenda **Variables** na weka:

| Variable Name | Thamani | Maelezo |
|---|---|---|
| `NODE_ENV` | `production` | Hali ya uzalishaji |
| `PORT` | `3000` | Port ya Next.js |
| `NEXT_PUBLIC_API_URL` | `https://academic-api-production.up.railway.app/api/v1` | URL ya Backend API uliyoiweka hapo juu |

6. **Health Check**:
   - **Healthcheck Path**: `/`

---

## 6. Uthibitisho wa Usalama Uliotekelezwa (Security Hardening Highlights)

1. **Helmet HTTP Headers**:
   - X-Frame-Options (Inazuia Clickjacking).
   - X-Content-Type-Options: `nosniff` (Inazuia MIME-sniffing exploits).
   - HSTS (Strict-Transport-Security) ya mwaka 1 iliyowezeshwa kwenye uzalishaji.
   - `poweredByHeader: false` (Inaficha kuwa mfumo unatumia Express/Next.js).

2. **CORS Policy Yenye Ulinzi**:
   - Hakuna tena `origin: '*'` na credentials. Sasa inakagua domain zilizoidhinishwa tu (`CORS_ORIGIN`).

3. **Ulinzi wa JWT Secret**:
   - Ikiwa mfumo utawashwa katika `NODE_ENV=production` bila `JWT_SECRET` thabiti, mfumo unakataa kuwaka na kutoa tahadhari ya kiusalama mara moja ili kuzuia token forgery.

4. **Container Security**:
   - Containers zinatumia mtumiaji asiye root (`nestjs` na `nextjs`) na `dumb-init` kwa usimamizi salama wa michakato (PID 1 signal handling).
   - Binding imewekwa kwenye `0.0.0.0` ili kuhakikisha afya ya container (liveness probe) inafanya kazi bila hitilafu.

5. **Uchunguzi wa Afya (Health Checks)**:
   - Endpoint mpya salama ya `/api/v1/health` inathibitisha liveness ya API na mawasiliano ya database kabla ya Railway kuelekeza watumiaji.
