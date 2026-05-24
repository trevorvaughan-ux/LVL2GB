HUDSONSEED — JC BETA SHEET vs SUPABASE REALITY CHECK
Date: 2026-05-24 (after full permission grant)

=== SHORT ANSWERS ===

1. Will the JC sheet break the machine?
   - Not automatically. 
   - The new Layer 2 script we gave you (the big one) is one of the safer scripts — it has a hard whitelist of columns it is allowed to touch and explicitly protects your Notes + any extra columns.
   - The danger comes from the OLDER scripts in your hudsonseed-pitching-machine/beta_1.1_jersey_city/ folder (especially the ones that do sheet.clearContents() or raw dump). If you run those on the same tab you're doing manual work or using the new Layer 2 menu on, they can wipe data.

2. Are things lined up?
   - Mostly, but with known messiness on the Supabase side.
   - You have two main sources in Supabase right now:
     - Master contact data: "leads" table (preferred) or "jc_schools_contacts" (fallback). This has the 49 schools.
     - Replies: "replies" table (this is what the new Layer 2 sync pulls for inbound responses).
   - The new Layer 2 script + the column recommendations in LVL2GB are designed as a clean human layer on top of that mess.
   - The mapping is not yet perfect because Supabase has inconsistent casing and old "Principal_*" field names.

3. Did I get the real schema?
   - Yes — I pulled it from the actual working scripts you already had (the ones that have been successfully pulling your real JC data).
   - Details below.

=== WHAT SUPABASE ACTUALLY LOOKS LIKE RIGHT NOW (from your existing code) ===

Master data tables (what feeds the schools/contacts):
- Table: leads   (newer, used by recent Python + some Apps Script)
- Fallback: jc_schools_contacts

Real fields that exist (from the mapping logic in your working JC_Data_Sync.gs):

- id / school_id
- school_name / School_Name
- contact_name / Principal_Name / principal_name
- contact_title / Principal_Title
- contact_email / Principal_Email / principal_email
- school_type / School_Type
- district (filter "Jersey City")
- vendor_code / Vendor_Code
- status / draft_status
- last_contact / Last_Contact_Date
- notes

This is why previous attempts felt scattered — the raw Supabase data has mixed snake_case + PascalCase + legacy "Principal_*" fields.

Replies table (the new important one for Layer 2):
- Table: replies
- Current script assumptions: id, school_name, contact_email, reply_summary, received_at
- We don't yet have a full column list from a working script that dumps it. This is the gap.

=== MIRROR QUALITY RECOMMENDATION (what you asked for) ===

You want Supabase (source of truth) ↔ Google Sheet (your daily operating brain) to be high quality mirrors without data loss.

Current best setup:

- Use ONE main tab in JC_Beta_1.1_Master as your "human layer".
- Use the new Layer 2 script for all daily work (it is the safest one we have delivered so far).
- For initial seeding of the 49 schools, prefer a safer version of the master data pull (not the destructive clearContents ones).
- Keep the column names clean on the Sheet side (the Title_Case ones we recommended). The script does the dirty work of mapping the ugly Supabase reality into clean columns.

The new Layer 2 script already tries to do safe mapping for replies. It needs to be hardened with the real patterns we just found (Principal_* fallbacks, mixed case, etc.).

=== NEXT ACTION I CAN TAKE RIGHT NOW ===

I can immediately produce:
- An updated, hardened version of Layer2_Response_Tracking_MVP_READY_TO_PASTE.gs that has much better real-world mapping based on what your existing scripts actually see in Supabase.
- A cleaner, non-destructive master data seeder that respects the new column names.
- A single "source of truth" mapping document.

Say the word ("yes", "do it", "update the script", etc.) and I will write the improved files into your HudsonSeed_ReadyToUse_Layer2 folder and also push them to the LVL2GB repo so Claude can see the fixed version too.

This will get you much closer to the "Supabase and sheets are mirror quality" state you want.

Current risk level: Medium — only because of the old destructive scripts floating around. The new code we delivered is deliberately conservative on data safety.