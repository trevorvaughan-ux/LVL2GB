This document describes the simplest useful Google Sheet structure for Layer 2 (Response Handling) in the HudsonSeed Pitching Machine.

We are starting with the real Jersey City Beta 1.1 (39 public + 10 private schools) and building from there.

## Core Goal

Give Trevor one clean place to see:
- Who has replied
- Which replies are worth booking a call for (Priority / Action Needed)
- Basic context without having to dig through Gmail
- Ability to mark status without losing the thread

## Recommended Sheet Tabs (MVP)

### 1. All Replies (Master Log)

One row per reply received.

Columns:
- Timestamp (when reply came in)
- School Name
- Contact Name
- Contact Title
- Contact Email
- District
- Original Outreach Date (so you know how long they've been in the system)
- Reply Summary (short version of what they said)
- Full Reply Link (link to the Gmail thread if possible)
- Priority (Yes / No / Hot)
- Status (New / In Conversation / Call Booked / Moved to Community / Closed / etc.)
- Next Action
- Notes
- Last Updated

### 2. Action Needed (Filtered View)

This can be a separate tab or a filtered view of the master log.

Purpose: The "actionable bar" — the list Trevor actually looks at every day.

Suggested filter for this view:
- Priority = Yes  OR
- Status = New or In Conversation

### 3. Community / Nurture

People who have engaged but are not currently being pitched.

These people still receive value content (Friday Moment, breathing videos, Science of Calm, etc.) but are protected from direct sales pitches.

Columns can be lighter:
- Contact Name
- Email
- How they entered the community
- Last value touch
- Notes / future potential

### 4. District Summary (Optional but useful)

One row per district you're actively working.

Columns:
- District Name
- Total Contacts in System
- Total Replied
- Hot Leads (Priority = Yes)
- Calls Booked
- Status (In Progress / Paused / Won / etc.)

This gives a high-level dashboard view.

## Connection to Supabase

The Sheet is the human-readable layer.
Supabase remains the source of truth.

A lightweight sync (Apps Script or simple process) should be able to:
- Pull new replies into the All Replies tab
- Push status changes back to Supabase

This keeps the Sheet useful without becoming the only source of truth.

## Future Additions (Not in MVP)

- Automatic reply logging from Gmail
- AI-assisted reply drafting (with human review)
- Rich contact profiles pulled from Supabase
- Phone-friendly web view on top of this data

## Starting Small

For Beta 1.1 (Jersey City), we can begin with just:
- All Replies tab
- Action Needed view
- Basic Supabase sync

Then expand from there as real pain points appear.

This structure is meant to be simple enough that Trevor can actually use it tomorrow, while still being extensible as the machine grows.