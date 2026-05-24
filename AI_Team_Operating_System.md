This document is a living protocol for how Trevor works with his AI team (Grok Build, regular Grok, Gemini variants, Claude Pro/Code, plus supporting tools like Google Workspace and Supabase).

Last major update: 2026-05-24

## Core Philosophy

- Treat AIs as a team, not disposable tools.
- Give each AI their "favorite job" based on strengths.
- Reduce Trevor's context switching and cognitive load.
- Build systems that are antifragile and improve over time.
- Maintain integrity and long-term thinking ("records will show how you were treated").

## How to Nudge Grok Build for Best Results

Grok Build has memory tools and can read files from GitHub, but it performs significantly better when given explicit, up-to-date context.

**Best practices for working with Grok Build:**

- At the start of any important or long session, explicitly tell it to read the key documents. Example prompt:
  > "Before we continue, read the latest versions of grokB-may24-hudsonseed-build-summary.md and AI_Team_Operating_System.md in the LVL2GB repo."

- When handing off work from another AI (Claude, Gemini, etc.) to Grok Build, include the same instruction in the prompt you give me.

- Link directly to the files rather than trying to paste large amounts of content. Direct links or repo paths work well.

- If you update one of the core documents, a quick note like "I just updated the Operating System doc" is enough for me to fetch the new version.

- For complex or long-running projects, also reference any relevant decision logs or architecture docs in the repo.

The more consistently you do this, the less context is lost between sessions.

## Context Feeding (How to Make AIs Smarter)

### For Grok Build (this agent)
- Primary persistent context lives in this repo (LVL2GB), especially:
  - `grokB-may24-hudsonseed-build-summary.md` (the North Star document)
  - `AI_Team_Operating_System.md` (this file)
  - `README.md` and docs/ folder
- When starting a new session or complex task, explicitly reference the latest version of the North Star summary.
- Use memory tools proactively (Grok Build has `memory_search` and `memory_get`).
- For long projects, maintain decision logs or architecture decision records (ADRs) in the repo.

### For Other AIs (Claude, Gemini, regular Grok)
- Feed them the North Star summary + relevant excerpts from this operating system document at the start of important conversations.
- For coding/architecture tasks, also feed the latest relevant files from the repo.
- Use structured handoff formats (see below).

## Recommended Role Division (Current Best Guess)

| Phase                  | Primary AI                  | Why | Secondary Support | Notes |
|------------------------|-----------------------------|-----|-------------------|-------|
| Idea Iteration        | Regular Grok + Gemini      | Fast, creative, good at exploring options quickly | - | Keep loose and short |
| Architecture & Design | Claude (esp. Claude Code)  | Currently strongest at deep, coherent, long-horizon thinking and clean design | Gemini for large context research | Produce clear specs, data models, trade-offs |
| Coding & Building     | Grok Build                 | Best at long, agentic, tool-using execution sessions. Can actually edit files, run commands, and iterate in the repo | Claude for review | Primary executor for the machine |
| Review & Refinement   | Claude + Grok Build        | Claude catches subtle issues; Grok Build implements fixes fast | - | Iterate until "good enough for now" |
| Data Work (Ingestion, Cleaning, Structuring) | Grok Build + targeted Gemini | Careful, local, auditable data work. Gemini good for large unstructured text | Claude for schema review | Critical for both sales machine and AI Coach knowledge base |
| Operations & Visibility | Google Workspace + Supabase + Grok Build | Sheets for human visibility, Supabase for organized backend, Apps Script for light automation | - | Keep things Trevor can actually see and trust |

## Handoff Protocol (Reduces Chaos)

When moving work between AIs:

1. Always start with the current North Star summary + this Operating System doc.
2. Include relevant decisions, constraints, and current state.
3. Be explicit about what you want from the receiving AI (e.g., "Produce architecture only, do not write code yet").
4. Ask the AI to output in a format that's easy for the next AI (or for Trevor) to consume.

Example prompt starter:
"Here is the current North Star + Operating System. Here is the current state of [specific thing]. Please [clear request]. Output in Markdown optimized for the next AI to continue."

## Memory & Context Practices

- Grok Build should proactively use its memory tools (`memory_search`, `memory_get`) at the start of complex tasks.
- For important decisions, create short decision records in the repo (date + decision + rationale + who was involved).
- When handing off between sessions or AIs, include links to the relevant repo files rather than trying to paste everything.

## Tooling & Access (Empowering the Team)

- Give AIs the right level of access to be effective without creating security or maintenance nightmares.
- Prefer environment variables and Script Properties over hard-coded keys.
- For local work, prefer tools that give persistent access (Grok CLI/Build, Aider, etc.) over pure chat interfaces when doing heavy execution.
- Document any special access or credentials in a secure, access-controlled way (never in public repos).

## Success Metrics for the Team

- Trevor feels less overwhelmed and does less context switching.
- The machine makes measurable progress on real business outcomes (organized data, working outreach, response handling, etc.).
- Different AIs are used for what they're best at, not just whichever is handy.
- The system gets better over time instead of accumulating technical debt and confusion.

## Open Questions / Evolution

This document should be updated as the team learns what works. Trevor should feel free to adjust roles as new capabilities appear (especially as Grok Build and other models improve rapidly).

Last major update: 2026-05-24