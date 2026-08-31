# consent-gate

## The problem

US call-recording consent law isn't uniform. Some states are **one-party consent** (only the recorder needs to agree), others are **all-party consent** (everyone on the call must explicitly agree) — and when a call crosses state lines, the stricter rule governs. An AI voice agent that records every candidate call by default is exposed to real legal risk the moment it operates across states, especially at scale, where a single prompt regression or missed disclosure can affect hundreds of calls before anyone notices.

## The solution: two safety nets, not one

1. **Real-time gate.** The interview doesn't start recording until the candidate has given clear, unambiguous consent. A fast local string match handles the common case for free; an LLM classifier (Claude Haiku) handles anything off-script; if it's still ambiguous after one re-ask, the gate defaults to *not recording* — never the other way around.
2. **Post-call audit.** The gate can still fail silently — a prompt regression, an interrupted call, an edge case it missed. So every single call, no sampling, gets independently re-checked afterward: did the agent actually disclose the call could be recorded, did the candidate actually consent, given what the transcript really says. Calls that fail this check are flagged `should_be_deleted` so the recording can be purged before it's ever used or retained.

The audit exists because the gate alone isn't sufficient — it can break, and the system needs a way to catch that after the fact instead of just trusting the gate always works.

## This is a prototype — and it's built to plug into a real voice agent

The state-rule lookup, the consent gate's decision logic, the Claude-based classification and audit, and the Postgres persistence layer are all real — same code that would run in production. What's simulated is the *call itself*: a browser tab standing in for a live phone call, and either typed text or the browser's `SpeechRecognition` API standing in for real-time speech-to-text.

Wiring this into an actual voice AI agent means replacing that one piece — the input source — while keeping everything downstream unchanged:

- Swap the browser mic/text input for the agent's real ASR stream (e.g. a Twilio Media Stream piped through a speech-to-text provider).
- Feed each transcribed candidate turn into the same `POST /api/consent/classify` endpoint — it doesn't know or care whether the text came from a browser or a live call.
- Feed the finished call's transcript into the same `POST /api/calls` endpoint, which triggers the same audit, on the same schedule (every call, immediately).

No part of the compliance layer needs to change to go from "simulator" to "production." That's the point.

## Running it locally

**Prerequisites:** Postgres running locally with a `consent_gate` database, and a real `ANTHROPIC_API_KEY`.

```sh
# Backend
cd backend
cp .env.example .env   # fill in ANTHROPIC_API_KEY and APP_PASSWORD (required, no default)
npm install
npm run start:dev      # http://localhost:3000

# Frontend, in a second terminal
cd frontend
npm install
npm run dev             # http://localhost:5173
```

Open `http://localhost:5173`. You'll be asked for the app password first — it's whatever you set as `APP_PASSWORD` in `backend/.env`.

Voice input (the 🎤 Speak button) needs a Chromium-based browser (Chrome, Edge) — it falls back to a text field on browsers without `SpeechRecognition` support, or if the candidate blocks mic access. Brave blocks this by policy with no user-facing override; use Chrome to see the voice path live.

## 3-minute demo script

1. **Frame the problem.** Open the Simulator tab. Read the intro copy: consent-recording law isn't uniform across US states — some are one-party, some are all-party, and the stricter rule wins across state lines.
2. **Pick a state.** Select California (all-party). Point out the consequence copy changes based on the rule.
3. **Run a clean call.** Scroll to "Simulate the call." Say (or type) `yes, I consent` — show the recording indicator turn live, with zero API calls (it resolved on the local string match, not Claude).
4. **Run an ambiguous call.** Pick another state, reply with something off-script like `sure, that's fine` — show it still resolves correctly via the real Claude Haiku fallback. Try something genuinely unclear (`hmm, I don't know`) to trigger the re-ask, then answer again to show the retry-then-safe-default behavior.
5. **Trigger the failure case.** Start a new call, check "Simulate agent bug" instead of answering the consent question — this is the gate silently failing, the exact scenario production systems don't catch.
6. **Show the audit catches it.** Switch to the Audit log tab. Point at the flagged call: `compliant: false`, `should_be_deleted: true` — the post-call audit (Claude Sonnet, reading the actual transcript) caught what the gate missed, on every single call, not a sample.
7. **Filter the log.** Use the state/rule/compliance filters to show this scales to reviewing many calls at once.

## Stack

NestJS + PostgreSQL (TypeORM) on the backend, React + Vite on the frontend, Claude (Haiku for classification, Sonnet for audit) via the Anthropic SDK with structured outputs — no prompt injection surface left unguarded, no free-text parsing.

See `CLAUDE.md` for the full architecture notes, data model, and design decisions (kept out of git — ask if you want a copy).
