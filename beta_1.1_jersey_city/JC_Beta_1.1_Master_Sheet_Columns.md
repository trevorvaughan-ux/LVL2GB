This document gives the exact column headers for the `JC_Beta_1.1_Master` Google Sheet.

The goal is one clean, practical sheet you can use every day for the current Jersey City beta (39 public + 10 private schools) that supports:

- Feeding your existing Layer 1 (draft generation)
- Tracking replies with zero pressure (Layer 2)
- Logging value touches (Friday Moment, breathing videos, Science of Calm, etc.)
- Moving people into Community when they engage (no more pitching)
- Keeping you organized during long sales cycles

---

## Recommended Columns (in this order)

Copy these exact headers into Row 1 of your sheet:

1. School_ID (stable ID from Supabase or your source)
2. School_Name
3. School_Type (Public / Private)
4. District (always "Jersey City" for this beta)
5. Contact_Name
6. Contact_Title (Principal, Enrichment Director, Superintendent, Board Member, etc.)
7. Contact_Email (real working email)
8. Vendor_Code (V00108320 or whatever applies)
9. Engagement_Status (pending / drafted / replied / priority / community / call_booked / materials_sent / closed)
10. Priority (Yes / Warm / No)   ← your quick "actionable bar" filter
11. Last_Value_Touch (e.g. Friday Moment, Breathing Video, Science of Calm deck, Hanuman preview)
12. Last_Value_Touch_Date
13. Next_Action (Schedule call, Send breathing video, Follow up in 2 weeks, etc.)
14. Notes (your private notes — never overwritten by syncs)
15. Last_Updated

---

## How to Use These Columns

- **Priority column**: Filter or sort by "Yes" to see your daily actionable bar.
- **Engagement_Status**: Use "Community" for anyone who has opened or replied (zero pressure from now on).
- **Last_Value_Touch** + **Date**: Track the value you are consistently giving so you stay top of mind.
- **Next_Action**: What you need to do next with this person.
- **Notes**: Safe space for your thoughts — the sync scripts are written to never touch this column.

---

## Tabs You Should Create

- All Contacts (or All Schools)
- Action Needed (filtered view of Priority = Yes or Status = replied/priority)
- Community (people receiving only value/nurture)
- District Summary (optional but useful for overview)

---

This structure is deliberately simple so you can start using it immediately with the current 49 schools without overcomplicating things.

It is designed to work with the current `Layer2_Response_Tracking_MVP.gs` script and your existing Layer 1 draft generation.