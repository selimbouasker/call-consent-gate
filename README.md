# consent-gate

## The problem

US call-recording consent law isn't uniform. Some states are **one-party consent** (only the recorder needs to agree), others are **all-party consent** (everyone on the call must explicitly agree) — and when a call crosses state lines, the stricter rule governs. An AI voice agent that records every candidate call by default is exposed to real legal risk the moment it operates across states, especially at scale, where a single prompt regression or missed disclosure can affect hundreds of calls before anyone notices.

## The solution: two safety nets

- **Real-time gate** — recording doesn't start until the candidate clearly consents. Local match first (free), Claude Haiku fallback if off-script, one re-ask, then a safe default (*not recording*) if still unclear.
- **Post-call audit** — every single call, no sampling, gets independently re-checked: did the agent disclose, did the candidate actually consent. Non-compliant calls are flagged `should_be_deleted`.
- The audit exists because the gate can fail silently — it's the check that catches that.

## Prototype, built to plug into a real voice agent

- **Real**: state-rule lookup, gate logic, Claude classification/audit, Postgres persistence — production code as-is.
- **Simulated**: the call itself — a browser tab in place of a live phone call, typed text or `SpeechRecognition` in place of a production ASR (speech-to-text) pipeline.

To wire into a real agent:
- Swap the browser mic/text input for the agent's ASR stream (e.g. Twilio Media Stream → speech-to-text).
- Feed each transcribed candidate turn into `POST /api/consent/classify`.
- Feed the finished transcript into `POST /api/calls` — same audit, same schedule (every call, immediately).

No part of the compliance layer changes going from simulator to production.

## Running it locally

Prerequisites: Postgres running locally with a `consent_gate` database owned by a `consent_gate` role (Prisma needs an explicit user in the connection string — `createdb consent_gate && psql -c "CREATE ROLE consent_gate LOGIN CREATEDB" && psql -c "ALTER DATABASE consent_gate OWNER TO consent_gate"`), and a real `ANTHROPIC_API_KEY`.

```sh
# Backend
cd backend
cp .env.example .env   # fill in ANTHROPIC_API_KEY and APP_PASSWORD (required, no default)
pnpm install
pnpm run prisma:migrate:dev   # creates the transcripts table
pnpm run start:dev     # http://localhost:3000

# Frontend, in a second terminal
cd frontend
cp .env.example .env    # points VITE_BACKEND_URL at the backend above
pnpm install
pnpm run dev            # http://localhost:5173
```

- Open `http://localhost:5173` — you'll be asked for `APP_PASSWORD` first.
- Voice input needs Chrome or Edge. Falls back to a text field if unsupported or mic-blocked. Brave blocks it by policy, no override.

## Stack

- Backend: NestJS, PostgreSQL (Prisma)
- Frontend: React, Vite
- AI: Claude Haiku (classification) + Sonnet (audit), Anthropic SDK, structured outputs
- Package manager: pnpm
