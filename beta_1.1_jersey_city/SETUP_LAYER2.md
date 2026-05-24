This guide walks you through setting up the **complete production Layer 2 (Response Tracking)** system for the current Jersey City Beta 1.1 (39 public + 10 private schools).

**Goal:** A single, reliable, phone-friendly Google Sheet + one Apps Script file that lets you see every reply, act on priority leads, move engaged contacts to the zero-pressure Community track, log value touches, and schedule Google Meets — all while protecting your manual notes forever.

---

## Step 1: Create the Master Sheet

1. Google Drive → New → Google Sheets
2. Name it exactly: `JC_Beta_1.1_Master`
3. Create these tabs (recommended):
   - All Contacts (or All Schools) — the main working tab
   - Action Needed (filtered view or separate for Priority=Yes)
   - Community (value/nurture only)

---

## Step 2: Headers (Critical — use the exact names)

Copy the canonical list from:
`beta_1.1_jersey_city/JC_Beta_1.1_Master_Sheet_Columns.md`

Or import the ready CSV:
`beta_1.1_jersey_city/JC_Beta_1.1_Final_Master_Template.csv`

Minimum required columns for the script to work at full power:
School_ID, School_Name, Contact_Email, Engagement_Status, Priority, Last_Value_Touch, Last_Value_Touch_Date, Next_Action, Notes, Last_Updated

The script ships with a full `COL` constant object — edit it in the .gs if you want different header names.

---

## Step 3: Install the Complete Layer 2 Script

1. In `JC_Beta_1.1_Master`, go to **Extensions > Apps Script**
2. Delete the default `function myFunction() {}` code
3. Open this file in the LVL2GB repo:
   `apps_script/Layer2_Response_Tracking_MVP.gs`
4. Copy the **entire contents** and paste into the Apps Script editor
5. **Save** (floppy disk icon)

---

## Step 4: Add Your Supabase Key (one time)

1. In Apps Script, click the gear (Project Settings) on the left sidebar
2. Under "Script Properties" click "Add script property"
3. Property: `SUPABASE_KEY`
   Value: paste your Supabase **service_role** key (keep this private)
4. Save

---

## Step 5: First Run & Authorization

1. In the editor, select `syncRepliesToSheet` from the function dropdown (top center)
2. Click the Run ▶️ button
3. Google will ask for authorization — review and allow (you only do this once per script)
4. Go back to your Google Sheet and **refresh the browser tab**

You should now see the custom menu at the top:
**🌱 HudsonSeed Machine (Layer 2)**

---

## Step 6: The Full Menu (what you actually use every day)

- 🔄 Sync Recent Replies from Supabase (Safe) — pulls new replies without ever touching your Notes or extra columns
- 🔥 Mark Selected as PRIORITY — your daily actionable bar
- 💙 Mark Selected as Warm / Future Opportunity
- 🏠 Move Selected to COMMUNITY — any engagement = zero-pressure value track forever
- 📅 Schedule Google Meet for Selected — creates Calendar event + logs date + link in the sheet
- 📝 Log Value Touch — Friday Moment, breathing video, Science of Calm, etc.
- 📦 Log Materials Sent (with small CTA)
- ✍️ Insert Low-Pressure CTA Snippet — ready-to-paste text for your emails
- ❓ Show Quick Help & Column Status

---

## Daily Phone-Friendly Workflow (Jersey City Beta)

1. Morning: open `JC_Beta_1.1_Master` on your phone
2. Menu → Sync Recent Replies
3. Scroll or filter to new "replied" rows
4. Select the hot ones → 🔥 Mark as PRIORITY
5. For anything that engaged → 🏠 Move to COMMUNITY
6. When you book a call → 📅 Schedule Google Meet (it hits your Calendar automatically)
7. After sending value or materials → use the Log actions + the CTA snippet helper
8. Your Notes column stays 100% yours — sync never touches it

---

## Safety & Philosophy Guarantees

- Safe merge: only writes to the MANAGED_COLUMNS list defined in the script
- Any real engagement → Community (no more pitching)
- Zero pressure language everywhere
- No pixels, no tracking, no spam
- Google Meet + Calendar integration built in

---

## Next (when you feel like it)

- Add more columns (the script will ignore them)
- Extend the REPLY_FIELD_MAP if your Supabase replies table has extra fields
- Hook the optional `pushStatusToSupabase` helper to write status back
- Use the same pattern for the next 8 districts

Everything you need to test the full low-pressure sequence on the live 49-school beta is now in one place.

**The code is deliberately complete and reviewable so Claude, Gemini, and future you can read it, edit it, and improve it without mystery.**
