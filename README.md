# LeadPilot 🚀

LeadPilot is an AI-powered B2B Customer Relationship Management (CRM) platform built to help sales teams manage companies, contacts, leads, activities, and follow-ups from a single system.

The project combines a traditional CRM backend with an AI-powered Lead Assistant that analyzes CRM context and provides lead summaries, concerns/interests, next-best-action recommendations, and personalized follow-up drafts.

---

## ✨ Features

### 🔐 Authentication & Security

- JWT-based authentication
- Spring Security integration
- BCrypt password hashing
- Stateless authentication
- Protected REST APIs
- Secure user management
- Lead assignment and reassignment between sales team members

---

### 🏢 Company Management

Manage prospect/customer organizations with:

- Company name
- Industry
- Website
- Phone
- Email
- Address

A company can have multiple contacts and leads.

---

### 👤 Contact Management

Manage individual contacts associated with companies.

Each contact can contain:

- Name
- Email
- Phone
- Designation
- Associated company

A contact can be associated with multiple leads.

---

### 🎯 Lead Management

LeadPilot provides complete lead lifecycle management.

Each lead contains:

- Lead name
- Company
- Contact
- Assigned salesperson
- Lead source
- Current stage
- Estimated deal value
- Notes

Supported lead stages:

```text
NEW
CONTACTED
INTERESTED
PROPOSAL
WON
LOST
```

Supported lead sources include:

```text
WEBSITE
REFERRAL
COLD_CALL
EMAIL
LINKEDIN
OTHER
```

Sales team members can also reassign leads between users.

---

### 📝 Activity Tracking

Activities are used to maintain the historical CRM timeline of a lead.

Supported activity types include:

- Calls
- Meetings
- Notes

Lead activity history can be retrieved and analyzed by the AI assistant.

LeadPilot also includes an automatic lifecycle rule:

```text
NEW → CONTACTED
```

The first activity on a new lead automatically moves the lead from `NEW` to `CONTACTED`.

---

### 📅 Follow-up Management

Salespeople can create future follow-up tasks for leads.

Each follow-up contains:

- Title
- Description
- Due date
- Status
- Associated lead

Follow-up statuses:

```text
PENDING
OVERDUE
COMPLETED
```

A scheduled backend job automatically checks pending follow-ups and marks them as `OVERDUE` once their due date has passed (runs every 60 seconds).

---

### 📊 Dashboard & Pipeline Analytics

LeadPilot provides CRM dashboard analytics including:

- Total leads
- Lead count by stage
- Total pipeline value
- Won pipeline value
- Lost pipeline value
- Pending follow-ups
- Overdue follow-ups
- Completed follow-ups

This gives sales teams a quick overview of their current pipeline and follow-up workload.

---

## 🤖 AI Lead Assistant

The main differentiating feature of LeadPilot is its AI-powered Lead Assistant.

Instead of using an LLM as a generic chatbot, the AI receives actual CRM context for a specific lead.

The assistant considers:

- Lead profile
- Company information
- Contact information
- Current lead stage
- Lead source
- Estimated deal value
- CRM notes
- Historical activities
- Existing follow-ups

The AI then generates a structured analysis containing:

### 1. Lead Summary
A concise summary of the current sales situation.

### 2. Interests & Concerns
Identifies relevant interests, objections, or concerns based on available CRM data.

### 3. Next Best Action
Suggests the most appropriate next action based on the lead's current stage and historical context. The recommendations are stage-aware:

```text
NEW         → Initial outreach
CONTACTED   → Qualification / continued conversation
INTERESTED  → Address concerns / move toward proposal
PROPOSAL    → Proposal follow-up / objection handling
WON         → Onboarding / implementation
LOST        → Understand loss / possible future re-engagement
```

### 4. Personalized Follow-up Draft
Generates a follow-up message personalized using the available CRM context.

---

## 🧠 AI Architecture

```text
React Frontend
       ↓
Spring Boot REST API
       ↓
Lead + Company + Contact
       ↓
Activities + Follow-ups
       ↓
Structured Prompt
       ↓
Spring AI (ChatClient)
       ↓
Groq API
       ↓
LLM (gpt-oss-120b)
       ↓
Structured AI Response
       ↓
React Frontend
```

Lead analysis endpoint:

```text
GET /api/ai/leads/{leadId}
```

Example response:

```json
{
  "summary": "Enterprise Plan opportunity with XYZ Technologies...",
  "interestsAndConcerns": "The prospect is interested in an enterprise solution but has pricing concerns.",
  "nextBestAction": "Schedule an implementation kickoff meeting.",
  "followUpDraft": "Hi Rahul,..."
}
```

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │    React Frontend    │
                    │      + Vite          │
                    └──────────┬───────────┘
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │    Spring Boot       │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
       Spring Security     Service Layer      Spring AI
            + JWT               │                │
                                │                ▼
                                │          ┌───────────┐
                                │          │   Groq    │
                                │          │    LLM    │
                                │          └───────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │ PostgreSQL /         │
                    │ Supabase             │
                    └──────────────────────┘
```

---

## 🗂️ Domain Model

```text
User
 │
 │ assigns
 ▼
Lead
 │
 ├──────────────► Company
 │
 ├──────────────► Contact
 │
 ├──────────────► Activities
 │
 └──────────────► FollowUps
```

- **User** — a salesperson using the CRM
- **Company** — the prospect/customer organization; can have multiple contacts and leads
- **Contact** — an individual person inside a company; can have multiple leads
- **Lead** — a sales opportunity; belongs to one company, one contact, and one assigned salesperson
- **Activity** — a historical CRM interaction (call, meeting, note)
- **FollowUp** — a future sales task/reminder

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Language / Framework | Java 21, Spring Boot 4.1 |
| Security | Spring Security, JWT (JJWT), BCrypt |
| Persistence | Spring Data JPA, Hibernate |
| Database | PostgreSQL (Supabase) |
| AI | Spring AI (ChatClient), Groq API (`gpt-oss-120b`) |
| Frontend | React, Vite, JavaScript, CSS |
| Build / Tools | Maven, Git, GitHub, Postman |

---

## 📁 Project Structure

```text
leadpilot/
└── src/
    └── main/
        └── java/com/leadpilot/
            ├── config/
            ├── controller/
            ├── dto/
            │   ├── request/
            │   └── response/
            ├── entity/
            ├── exception/
            ├── repository/
            ├── security/
            └── service/
└── leadpilot-frontend/
    └── src/
```

Layered architecture: `Controller → Service → Repository → PostgreSQL`, with DTOs separating API request/response models from persistence entities.

---

## 🔒 Security Architecture

```text
User Login
    ↓
Credentials Validation
    ↓
JWT Generation
    ↓
Client Stores Token
    ↓
JWT sent with API requests
    ↓
JwtAuthenticationFilter
    ↓
Authenticated Request
```

Passwords are never stored in plaintext — hashed using BCrypt.

---

## 🔌 API Overview

### Auth & Users
```text
POST /api/users          — register a new user
GET  /api/users          — list users
POST /api/auth/login     — log in, receive a JWT
GET  /api/auth/me        — current authenticated user
```

### Companies
```text
POST   /api/companies
GET    /api/companies
GET    /api/companies/{id}
PUT    /api/companies/{id}
DELETE /api/companies/{id}
```

### Contacts
```text
POST   /api/contacts
GET    /api/contacts
GET    /api/contacts/{id}
GET    /api/contacts/company/{companyId}
PUT    /api/contacts/{id}
DELETE /api/contacts/{id}
```

### Leads
```text
POST   /api/leads
GET    /api/leads
GET    /api/leads/{id}
GET    /api/leads/company/{companyId}
GET    /api/leads/contact/{contactId}
PUT    /api/leads/{id}
DELETE /api/leads/{id}
```

### Activities
```text
POST   /api/activities
GET    /api/activities
GET    /api/activities/{id}
GET    /api/activities/lead/{leadId}
PUT    /api/activities/{id}
DELETE /api/activities/{id}
```

### Follow-ups
```text
POST   /api/follow-ups
GET    /api/follow-ups
GET    /api/follow-ups/{id}
GET    /api/follow-ups/lead/{leadId}
PUT    /api/follow-ups/{id}
DELETE /api/follow-ups/{id}
```

### Dashboard & AI
```text
GET /api/dashboard
GET /api/ai/leads/{leadId}
GET /api/ai/test?prompt=...
```

---

## ⚙️ Local Setup

### Prerequisites
- Java 21
- Maven
- Node.js
- PostgreSQL / Supabase database
- Groq API key

### Backend Setup
```bash
git clone https://github.com/aroravivek398/leadpilot.git
cd leadpilot
```

Set environment variables (do **not** hardcode these in `application.properties` or in IDE run configurations that get committed):
```bash
export SUPABASE_DB_URL="jdbc:postgresql://<host>:5432/postgres?user=<user>&password=<password>"
export GROQ_API_KEY="your-groq-api-key"
export JWT_SECRET="your-long-random-secret"
```

Run the backend:
```bash
./mvnw spring-boot:run
```
The backend runs on `http://localhost:8080`.

### Frontend Setup
```bash
cd leadpilot-frontend
npm install
npm run dev
```
The frontend runs on `http://localhost:5173`.

---

## 🔮 Future Improvements

The next major feature planned for LeadPilot is **RAG-based historical lead intelligence**:

```text
Current Lead
     ↓
Generate Embedding
     ↓
pgvector Similarity Search
     ↓
Retrieve Similar Historical Leads + Their Activities/Outcomes
     ↓
Combine With Current Lead Context
     ↓
LLM
     ↓
Better Next-Best-Action Recommendation
```

Other planned improvements:
- pgvector-based semantic search over historical CRM data
- RAG-powered recommendations
- AI Assistant UI in the React dashboard
- Production deployment
- Improved authorization and role management
- Automated testing
- Monitoring and observability

---

## 🎯 Project Goals

LeadPilot is being developed with a focus on demonstrating practical backend engineering and applied AI rather than building a simple LLM wrapper — REST API design, authentication/authorization, relational data modeling, scheduled background processing, CRM domain modeling, structured LLM output, and (soon) retrieval-augmented generation.

---

## 📌 Current Status

```text
Core CRM                    ✅
Authentication              ✅
Company Management          ✅
Contact Management          ✅
Lead Management             ✅
Lead Assignment              ✅
Activity Tracking           ✅
Follow-up Management        ✅
Overdue Detection            ✅
Dashboard Analytics          ✅
AI Lead Assistant            ✅
Stage-aware AI               ✅
Personalized AI Follow-up    ✅
pgvector RAG                 🚧
AI Frontend                  🚧
Deployment                   🚧
```

---

## 👨‍💻 Author

**Vivek R Kumar**
B.Tech Computer Science & Engineering, Indian Institute of Information Technology, Kalyani

- GitHub: https://github.com/aroravivek398
- LinkedIn: https://www.linkedin.com/in/vivek-r-kumar-870893327/
