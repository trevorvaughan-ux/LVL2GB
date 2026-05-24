# LVL2GB — HudsonSeed Pitching Machine Layer 2 (Complete)

**Level 2 = The answer to every response.**

This repo is the dedicated, clean workspace for the inbound half of the machine:

- See every reply in one place (Google Sheets — phone friendly)
- Priority / actionable bar for hot leads worth a call
- Zero-pressure Community track for anyone who engages
- Value-touch logging (Friday Moment, breathing videos, Science of Calm, etc.)
- Google Meet scheduling + Calendar integration
- Low-pressure CTA snippets and materials logging
- Safe, non-destructive sync from Supabase that **never** overwrites your manual Notes or extra columns

## Philosophy (non-negotiable)

- Zero pressure. Ever.
- Any engagement → Community (value/nurture track only from that moment).
- Stay top of mind for 6–18 months with real value.
- Small CTAs only. No spam, no pixels, no desperation.
- The 49-school Jersey City Beta 1.1 is the live test bed right now.

## The Complete Production Drop (May 2026)

Everything you need to run the full low-pressure sequence on the current beta is here and reviewable:

**The One File You Actually Install:**
`apps_script/Layer2_Response_Tracking_MVP.gs`

- 100% self-contained Apps Script
- Custom menu with every action you need daily
- Hardened safe-merge sync (protects Notes + user columns)
- Google Calendar Meet creation
- Low-pressure CTA helper dialog
- Extensive comments so Claude, Gemini, or future you can read it and "screw it in"

**Supporting Docs (ready to use):**
- `beta_1.1_jersey_city/SETUP_LAYER2.md` — 5-minute setup guide
- `beta_1.1_jersey_city/JC_Beta_1.1_Master_Sheet_Columns.md` — exact headers + why
- `beta_1.1_jersey_city/JC_Beta_1.1_Final_Master_Template.csv` — importable starting sheet
- `beta_1.1_jersey_city/TEST_FULL_SEQUENCE_CHECKLIST.md` — daily test flow for the real sequence

**AI Team Docs:**
- `AI_Team_Operating_System.md`
- `grokB-may24-hudsonseed-build-summary.md` (North Star)

## Quick Start (Jersey City Beta)

1. Create sheet `JC_Beta_1.1_Master`
2. Paste headers from the Columns doc (or import the CSV)
3. Extensions → Apps Script → paste the entire `Layer2_Response_Tracking_MVP.gs`
4. Add `SUPABASE_KEY` in Script Properties
5. Save, refresh, use the 🌱 menu

See SETUP_LAYER2.md for the full 5-minute walkthrough.

## For Claude, Gemini, and Other AIs

This is the "blow it out, all the script all the code" deliverable.

- The entire working system is in one .gs file + the matching docs.
- Fork the COL constants, the safe sync logic, the action functions — whatever you need.
- When you improve it, open a PR or just paste the new version back into the file via the repo.
- The goal is that any member of the AI team (or Trevor) can open the GS file and immediately understand and modify the machine.

## Relationship to the Rest of the Machine

- Layer 1 (outbound draft generation) lives in the parent repo: https://github.com/trevorvaughan-ux/hudsonseed-pitching-machine
- See `LAYER2.md` in that repo for the pointer back here.
- Data source of truth: Supabase (contact-centric)
- Human operating layer: Google Sheets (this is what Trevor actually lives in)

## Status

Production-ready MVP for the live Jersey City Beta 1.1.
Ready for real replies, real calls, real value touches, and real testing of the zero-pressure long-cycle approach.

Once this feels solid on 49 schools, the same pattern + script (with minor column tweaks) scales to the next 8 high-value districts.

---

**Owner:** Trevor Vaughan  
**Status:** Complete & live for the beta — iterate from here
**Last blown-out update:** 2026-05-24
