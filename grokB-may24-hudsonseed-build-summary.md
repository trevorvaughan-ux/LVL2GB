**grokB may24 hudsonseed build summary**

**Date:** May 24, 2026
**Owner:** Trevor Vaughan (HudsonSeed)
**Purpose:** North star / context document for any AI (Grok, Claude, Gemini, etc.) working on this project.

---

## Business Context & Model

- HudsonSeed sells an adapted **Kids Yoga & Mindfulness Teacher Training** program to K-12 schools and districts.
- The core program lives on yogarenewteachertraining.com. Trevor is the creator of the school-adapted version and a reseller.
- Pricing: **$200 per teacher**, paid by the school/district.
- Commission: **60%** when Trevor direct-sells (via purchase order + CSV) vs only **13%** when sold through YogaRenew’s system.
- Hard constraint: Trevor can **only sell B2B in bulk**. He is not allowed to sell B2C (individual teachers). This rules out ads and direct-to-teacher marketing.
- The real money is at the **district level** (Superintendents and Boards control the budget).
- Sales cycles are long (weeks to months).
- The product is digital, asynchronous, runs on classroom whiteboards, and is one license per teacher.
- When a school/district buys, Trevor supplies a CSV of teachers to YogaRenew. He keeps the teacher emails for future reselling of other products.
- Goal: Build a scalable, professional sales machine to win high-value districts without compromising integrity.

## Key Philosophy & Constraints

- Path of integrity: No desperate or spammy outreach.
- People who engage but don’t buy yet are moved into a **community/nurture track** (e.g., “Friday Moment” value emails) instead of being pitched repeatedly.
- Multiple parallel tracks are required (direct sales outreach + nurture/value content).
- Organization is non-negotiable because this business involves children.
- Data is effectively “infinite” — initial planned outreach + ongoing random referrals + warm network.
- Trevor wants an **antifragile** system that improves with use and doesn’t break under volume or messiness.

## Current Assets

- Strong existing network: Teachers trained, schools worked with, thousands of course participants from the B2B yoga course.
- Large volume of proprietary content: 200-hour training manuals, multiple modules (Foundations, Lesson Planning, Trauma-Informed, Ethics/Business, etc.), Teacher’s Guides for children and teens, case studies.
- Current live beta: **Jersey City (Beta 1.1)** — 39 public schools + 10 private schools (49 total). Has active JCPS vendor code.
- Additional data: Scattered across Google Drive (Docs & Sheets), LinkedIn, Instagram, Facebook, YouTube, local files, and previous AI session outputs. Includes labeled NYC District 1–8 files.
- Existing code: `hudsonseed-pitching-machine` repo (contains current Layer 1 / draft generation scripts, some of which are single-district / Jersey City focused).
- High-value target: Planning to focus first on 9 ultra high-value districts (7 in Manhattan + 2 in Jersey) representing ~250 schools. These districts have budgets larger than most countries.

## Current State of the Machine

- **Layer 1 (Outbound / Draft Generation):** Exists and works for a single district (Jersey City). Not yet generalized for multiple districts/campaigns.
- **Layer 2 (Response Handling & Visibility):** Early stage. Needs clean visibility of replies, priority/actionable leads, community/nurture tracking, and suppression logic so people aren’t spammed.
- **Data Layer:** Data lives in Supabase (Trevor’s preference for organization and cost) but is hard for him to see and work with directly. Much of the raw data is still scattered in Google Docs, Drive, exports, and other sources. Previous AI attempts at structuring this data have often produced messy or broken results.
- **Website / AI Coach:** Currently just a placeholder. The actual Yoga AI Coach (powered by Trevor’s curriculum) is in beta and not yet live.
- **Philosophy in action:** Deliberate staggered cadence (one district every two weeks) to stay sane and improve the machine between cycles.

## Vision for the Machine

A reliable, organized system where:
- Data (from any source) goes in and gets filed cleanly into Supabase using a contact-centric schema.
- Trevor has excellent visibility (Google Sheets as primary readable layer + future phone-friendly access).
- Layer 1 can generate outreach across multiple districts/campaigns without constant manual rework.
- Layer 2 surfaces priority leads and manages long sales cycles without leads falling through the cracks.
- Parallel tracks (sales + nurture) can run cleanly without spamming.
- The system supports both planned district outreach and random/referral inbound data over time.
- The machine compounds: the more quality data and campaigns fed in, the more consistent and leveraged the output (calls, POs, revenue) becomes.

## Immediate Priorities (as of May 24, 2026)

1. Organize the data Trevor already has (Drive + Google Docs for the first ~9–10 high-value districts) into Supabase + a clean, usable Google Sheet structure.
2. Evolve Layer 1 so it works reliably across multiple districts instead of being locked to Jersey City.
3. Begin the early version of Layer 2 focused on response visibility and priority tracking for the current beta.
4. Keep everything antifragile, low-maintenance, and inside tools Trevor already understands (Google Workspace + Supabase).

## North Star Reminder

Trevor is building this as a solo operator (with AI assistance) while running a real business involving children. The machine must reduce overwhelm, not add to it. Organization and integrity are non-negotiable. The goal is leverage and scale so he can "be everywhere" without personally doing everything.

---

**Last updated:** May 24, 2026
**Primary contact:** Trevor Vaughan (trevorvaughan@hudsonseed.com)

Use this document as shared context for any AI working on the HudsonSeed machine.