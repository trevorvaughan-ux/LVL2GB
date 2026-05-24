This is the beginning of Layer 2 of the HudsonSeed Pitching Machine.

This repo focuses on the "answer to all responses" part of the machine:
- Seeing who has replied (clean visibility / actionable bar)
- Tracking priority leads that are worth booking calls with
- Logging responses without spamming people
- Supporting long-term relationships (people who don't buy yet move into a community/nurture track instead of being pitched again)

## Philosophy (from Trevor)

- Path of integrity: No desperate pitching.
- People who engage but don't buy yet are still valuable (future buyers or champions).
- Multiple parallel tracks are needed (sales outreach + value/nurture like "Friday Moment" emails).
- Big money is at the district level (Superintendent + Board).
- The machine must support both planned campaigns and random referrals over time.
- "The more I put the dough in the machine, the pasta comes out."

## Current MVP Focus (Beta 1.1 – Jersey City)

Start small and real:
- 39 public schools + 10 private schools in Jersey City
- Make response handling for this specific beta actually usable
- Give Trevor a clean way to see replies and know what needs action
- Build on top of existing Supabase data + Google Sheets comfort zone

## Core Principles for This Layer

- Data ultimately lives in Supabase (organized, contact-centric).
- Trevor needs to actually *see* what is happening (Google Sheets as the primary readable layer + phone-friendly access later).
- Minimize rotating keys, fragile auth, and maintenance burden.
- Keep it stable — no crashes or chaos while running real outreach.
- Support multiple parallel communication tracks without spamming.

## Proposed MVP Components (Starting Small)

1. **Response Tracking Sheet**  
   A clean Google Sheet (or set of tabs) that shows:
   - Who has replied
   - Basic context (school, district, how they were contacted)
   - Priority / Action Needed flag
   - Notes / next step
   - Link back to original email thread (when possible)

2. **Supabase Sync (Light)**  
   Simple Apps Script or lightweight process that can:
   - Pull recent replies / new contacts from Supabase into the tracking sheet
   - Push status changes (e.g. "Priority", "Call Booked", "Moved to Community") back to Supabase

3. **Basic Actionable Bar**  
   A filtered view (in Sheets or a simple web view) that surfaces the highest-priority replies so Trevor can see what actually needs his attention today.

4. **Community / Nurture Track Support**  
   Ability to mark a contact as "Community" so they stop receiving direct sales pitches but can still receive value/nurture content (Friday Moment, etc.).

## Out of Scope for First MVP

- Full autonomous reply drafting and sending
- Complex multi-product purchase history tracking (future)
- Heavy authentication systems
- Beautiful custom dashboards (start with Sheets + simple views)

## Relationship to Existing Code

This repo is meant to work *with* the existing `hudsonseed-pitching-machine` repo.

**Main project repo:** https://github.com/trevorvaughan-ux/hudsonseed-pitching-machine

See the file `LAYER2.md` in the main repo for the direct connection.

Layer 1 (draft generation) lives in the main repo.
Layer 2 (response handling + visibility) starts here.

We are deliberately starting with the real, live Beta 1.1 (Jersey City) rather than trying to solve the infinite-data problem on day one.

## How to Explore This Repo

- `docs/MVP_Sheet_Structure.md` → Recommended Google Sheet structure for tracking replies
- `apps_script/` → Starter Apps Script examples

This repo exists as a concrete place to build against instead of just talking about it.

Let's build something real and useful for the current beta first.