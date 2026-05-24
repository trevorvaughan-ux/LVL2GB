This document summarizes the current strategy for the HudsonSeed Pitching Machine as of May 2026. It is intended to be the single clearest reference for other AI models (Claude, Gemini, etc.) to understand the vision, principles, and architecture without needing the full conversation history.

## Core Philosophy (Non-Negotiable)

- Zero pressure. Ever. Desperation is the worst cologne.
- B2B only (schools and districts). No consumer, no ads, no tracking pixels.
- Value-first, long-cycle nurturing (6–18 months).
- The machine must be **antifragile**: a simple but working Layer 1 that can still deliver ~85% value is better than a complex system that crashes and delivers 0%.
- Google Sheets is the primary human operating layer (phone-friendly, visible, trustworthy).
- Pre-staging of campaign data (sheets or CSVs created days ahead) is a first-class feature.
- We are Google — we should be all sheets where it makes sense for the human experience.

## Layer Model

### Layer 1 — Outbound (The Proactive Pitching Engine)
Generates and sends outreach. Must remain independently runnable ("dumb" or pre-staged mode) even if Layer 2 or the sync systems are unavailable. Primary input is "the dough" — a clean list of leads.

### Layer 2 — Response & Intelligence Layer (Current Focus)
Handles replies, visibility, prioritization, Google Meet scheduling, materials, and value touches. Lives primarily in Google Apps Script + the master Google Sheet.

Manages parallel tracks rather than a purely linear funnel:
- Sales track: Active outreach remains possible.
- Value / Community track: Once someone is labeled Community, they move into the "value bucket" as the primary/default engagement mode (Friday Moment, breathing videos, Science of Calm, etc.). They can still be in active sales conversations, but value nurturing becomes the default.
- Hard stop: Unsubscribed (nothing else goes out, ever).

Layer 2 is the intelligent *response* to Layer 1. It is not required for Layer 1 to function.

## Modular Architecture (Key Design Choice)

The system is deliberately broken into semi-independent blocks so parts can be improved, paused, or fail without destroying the whole machine:

- **Data Ingestion Layer** (future): Brings in leads from many sources (pre-staged Sheets/CSVs, Supabase, email, social media, AI-generated lists, warm intros, etc.) and normalizes them into usable "dough." Social media will eventually feed the Community/value track.
- **Supabase ↔ Google Sheets Sync**: Its own dedicated, schedulable unit. Can be improved or paused independently.
- **Layer 2 (Response + Intelligence)**: Includes the Community/value block as its own semi-separate track.
- **Layer 1 (Outbound)**: Must always have a working "dumb" path.

This modularity is what enables antifragility and the "pull a sheet from Drive and treat it as the dough for the next pasta" workflow.

## Daily / Campaign Sequence (Seamless in the Sheet)

1. Handle responses and make decisions in the Google Sheet (Layer 2).
2. One action (or export) produces a clean feed for outbound.
3. Layer 1 consumes that feed (or a pre-staged version) for the next round.
4. Repeat.

Pre-staging of campaign sheets in Drive is encouraged and supported.

## Antifragility Rules

- Layer 1 must always be able to run from a simple sheet/CSV export or local file, even if the fancy Layer 2 scripts, sync, or connector are down.
- Status decisions (especially Unsubscribed as a hard stop and Community as a shift to the value track) are respected when the connection is healthy, but never become a hard dependency.
- The Supabase ↔ Sheets sync is intentionally its own module.
- Multiple independent ways to get "the dough" for Layer 1 are supported by design.

## Current Focus (as of this summary)

Layer 2 is the current priority. The goal is to get a clean, complete, reviewable Layer 2 implementation (Apps Script + supporting sheet patterns) that treats the Community/value track as its own block and provides a seamless handoff to Layer 1. This version should be presentable to other AI models (Claude, Gemini, etc.) for review and iteration.

## How to Work With This Repo (for Other AIs)

- Start with `ARCHITECTURE_AND_VISION.md` and this `STRATEGY.md`.
- The Python side contains the antifragile Layer 1 loaders (`layer1_fallback_loader.py`, `google_sheet_loader.py`, etc.).
- The Apps Script side (in `HudsonSeed_ReadyToUse_Layer2/`) contains the Layer 2 implementation.
- `supabase_sheets_sync.py` is the dedicated sync unit.

Respect the antifragile core: simple reliable paths must always exist alongside the smarter integrated ones.

---

This strategy is designed to be readable and editable by both humans and other AI models. Build on it, critique it, or simplify it — but keep the modular, Google-native, antifragile principles intact.