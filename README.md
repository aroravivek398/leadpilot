# LeadPilot

**An AI-powered CRM for small sales teams** — built as a backend engineering portfolio project combining standard CRM workflows (leads, contacts, pipeline tracking) with an LLM-backed lead analysis assistant.

---

## What LeadPilot Does

LeadPilot helps a small sales team track companies, contacts, and leads through a pipeline, log activity history, manage follow-ups, and get AI-generated guidance on what to do next with a given lead.

- **Authenticated** — JWT-based login (BCrypt password hashing)
- **Full CRM data model** — Companies, Contacts, Leads, Activities, and Follow-ups, all linked and queryable
- **Pipeline tracking** — leads move through stages (`NEW → CONTACTED → INTERESTED → PROPOSAL → WON/LOST`), with automatic `NEW → CONTACTED` transition on first logged activity
- **Follow-up management** — scheduled follow-ups with a background job that automatically marks overdue ones
- **Dashboard analytics** — pipeline and follow-up status at a glance
- **AI lead analysis** — an LLM reads a lead's full activity and follow-up history and returns structured next-best-action guidance

---

## Core Features

### Authentication
- JWT-based login and registration, BCrypt password hashing
- Stateless Spring Security filter chain

### CRM Core
- Company → Contact → Lead hierarchy, with lead source tracking (`WEBSITE`, `REFERRAL`, `COLD_CALL`, `EMAIL`, `LINKEDIN`, `OTHER`)
- Activity logging per lead (`CALL`, `MEETING`, `NOTE`) — the first logged activity automatically advances a lead from `NEW` to `CONTACTED`
- Lead stage pipeline with full CRUD and ownership-aware access

### Follow-ups
- Scheduled follow-ups per lead with due dates
- A background scheduler (`@Scheduled`, runs every 60s) automatically flips `PENDING` follow-ups to `OVERDUE` once their due date passes — no manual polling needed

### Dashboard
- Aggregated view of pipeline distribution and follow-up status for the logged-in user

### AI Lead Analysis
- `ChatClient` (Spring AI) reads a lead's full context — profile, activity history, open follow-ups — and returns a structured response: interests/concerns, stage-aware next-best-action, and a drafted follow-up message
- Backed by a Groq-hosted open-weight model (`gpt-oss-120b`) via the OpenAI-compatible Spring AI starter, so swapping providers later only needs a config change

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language / Framework | Java 21, Spring Boot |
| Database | PostgreSQL (Supabase) |
| Auth | JWT (JJWT), BCrypt |
| AI | Spring AI (ChatClient), Groq (`gpt-oss-120b`, OpenAI-compatible API) |
| Frontend | React 19 (Vite) |
| Scheduling | Spring `@Scheduled` |
| Tools | Maven, Lombok |

---

## Architecture

```
                     ┌──────────────┐
  Client Request ──▶ │ JWT Filter   │
                     └──────┬───────┘
                            │
              ┌─────────────┼───────────────┐
              ▼              ▼               ▼
      ┌───────────┐  ┌───────────────┐  ┌──────────────┐
      │ Lead /    │  │ Activity →    │  │ AI Analysis  │──▶ Groq (gpt-oss-120b)
      │ Contact / │  │ auto-advances │  │ (ChatClient) │     via Spring AI
      │ Company   │  │ NEW→CONTACTED │  └──────────────┘
      │ CRUD      │  └───────────────┘
      └───────────┘
              │
              ▼
      ┌───────────────┐
      │ FollowUp       │◀── @Scheduled job flips
      │ (PENDING/      │    PENDING → OVERDUE
      │  OVERDUE/      │    every 60s
      │  COMPLETED)    │
      └───────────────┘
                            (PostgreSQL / Supabase)
```

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in, receive a JWT |
| GET/POST | `/api/companies` | List / create companies |
| GET/POST | `/api/contacts` | List / create contacts |
| GET/POST | `/api/leads` | List / create leads |
| PATCH | `/api/leads/{id}` | Update a lead (stage, details) |
| POST | `/api/leads/{id}/activities` | Log an activity against a lead |
| POST | `/api/leads/{id}/followups` | Schedule a follow-up |
| GET | `/api/leads/{id}/ai-analysis` | AI-generated next-best-action for a lead |
| GET | `/api/dashboard` | Pipeline and follow-up summary |

(Exact paths may vary slightly — see the controllers for the authoritative list.)

---

## Getting Started (Local)

### Prerequisites
- Java 21
- A PostgreSQL database (e.g. a free [Supabase](https://supabase.com) project)
- A Groq API key ([console.groq.com](https://console.groq.com)) — or any OpenAI-compatible endpoint

### Backend
Set the required environment variables (do **not** hardcode these in `application.properties` or in IDE run configurations that get committed):
```bash
export SUPABASE_DB_URL="jdbc:postgresql://<host>:5432/postgres?user=<user>&password=<password>"
export GROQ_API_KEY="your-groq-api-key"
```
Then:
```bash
./mvnw spring-boot:run
```
The API runs on `http://localhost:8080` by default.

### Frontend
```bash
cd leadpilot-frontend
npm install
npm run dev
```
Set `VITE_API_URL` in a `.env` file to point at the backend (defaults to `http://localhost:8080`).

---

## Status

Actively in development — core CRM flows, auth, follow-up scheduling, and AI lead analysis are implemented; deployment and additional test coverage are in progress.
