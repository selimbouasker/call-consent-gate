# consent-gate

A compliance layer for AI voice agents that conduct phone interviews at scale — a real-time consent gate that blocks recording until the candidate clearly agrees, plus a post-call audit that catches the cases where the gate silently failed.

## Running it locally

**Prerequisites:** Postgres running locally with a `consent_gate` database, and a real `ANTHROPIC_API_KEY`.

```sh
# Backend
cd backend
cp .env.example .env   # fill in ANTHROPIC_API_KEY, and optionally APP_PASSWORD
npm install
npm run start:dev      # http://localhost:3000

# Frontend, in a second terminal
cd frontend
npm install
npm run dev             # http://localhost:5173
```

Open `http://localhost:5173`. You'll be asked for the app password first — it's whatever you set as `APP_PASSWORD` in `backend/.env` (defaults to `consent-gate-demo` if you don't set one).

Voice input (the 🎤 Speak button) needs a Chromium-based browser (Chrome, Brave, Edge) — it silently falls back to text-only on browsers without `SpeechRecognition` support (e.g. Safari), or if the candidate blocks mic access.

## 3-minute demo script

1. **Frame the problem.** Open the Simulator tab. Read the intro copy: consent-recording law isn't uniform across US states — some are one-party, some are all-party, and the stricter rule wins across state lines.
2. **Pick a state.** Select California (all-party). Point out the consequence copy changes based on the rule.
3. **Run a clean call.** Scroll to "Simulate the call." Type (or speak) `yes, I consent` — show the recording indicator turn live, with zero API calls (it resolved on the local string match, not Claude).
4. **Run an ambiguous call.** Pick another state, reply with something off-script like `sure, that's fine` — show it still resolves correctly via the real Claude Haiku fallback. Try something genuinely unclear (`hmm, I don't know`) to trigger the re-ask, then answer again to show the retry-then-safe-default behavior.
5. **Trigger the failure case.** Start a new call, check "Simulate agent bug" instead of answering the consent question — this is the gate silently failing (the exact scenario production systems don't catch).
6. **Show the audit catches it.** Switch to the Audit log tab. Point at the flagged call: `compliant: false`, `should_be_deleted: true` — the post-call audit (Claude Sonnet, reading the actual transcript) caught what the gate missed, on every single call, not a sample.
7. **Filter the log.** Use the state/rule/compliance filters to show this scales to reviewing many calls at once.

## Project structure

See `CLAUDE.md` for the full architecture notes, data model, and design decisions (kept out of git, ask if you want a copy).
