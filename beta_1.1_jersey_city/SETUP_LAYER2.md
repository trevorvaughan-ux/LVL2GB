This guide walks you through setting up the basic Layer 2 (Response Tracking) system for the current Jersey City Beta 1.1 (39 public + 10 private schools).

Goal: Get a clean, usable view of replies so you can see priority leads and manage follow-up without losing track.

---

## Step 1: Create the Master Sheet

1. Go to Google Drive and create a new Google Sheet.
2. Name it: `JC_Beta_1.1_Master`
3. Create the following tabs (sheets) inside it:
   - All Replies
   - Action Needed
   - Community

---

## Step 2: Set Up the Columns

### All Replies tab
Copy these exact headers into row 1:

```
Timestamp, School Name, Contact Name, Contact Title, Contact Email, District, Original Outreach Date, Reply Summary, Priority, Status, Next Action, Notes, Last Updated
```

### Action Needed tab
Same headers as above (you will use filters or copy-paste from All Replies).

### Community tab
Simpler headers for now:
```
Contact Name, Email, How They Entered Community, Last Value Touch, Notes
```

---

## Step 3: Install the Layer 2 Script

1. In your `JC_Beta_1.1_Master` sheet, go to **Extensions > Apps Script**.
2. Delete all the default code in the editor.
3. Open this file in the repo and copy the entire contents:
   `apps_script/Layer2_Response_Tracking_MVP.gs`
4. Paste it into the Apps Script editor.
5. Click Save (the floppy disk icon).

---

## Step 4: Add Your Supabase Key

1. In the Apps Script editor, click the gear icon (Project Settings) on the left.
2. Under "Script Properties", add a new property:
   - Property: `SUPABASE_KEY`
   - Value: [paste your Supabase service role key]
3. Click Save.

---

## Step 5: Run the Sync for the First Time

1. In the Apps Script editor, select the function `syncRepliesToSheet` from the dropdown at the top.
2. Click the Run button (play icon).
3. Authorize the script when prompted (you only do this once).
4. Go back to your Google Sheet and refresh the page.

You should now see recent replies from Supabase appearing in the All Replies tab.

---

## Step 6: Use the Custom Menu

After refreshing the sheet, you should see a new menu at the top:
**🌱 HudsonSeed Machine (Layer 2)**

Use the menu items to:
- Sync new replies
- Mark selected rows as Priority or Warm
- Move people to Community (zero pressure track)

---

## Daily Workflow (MVP)

1. Open the sheet in the morning.
2. Run "Sync Recent Replies" from the menu (or run it manually when you get a notification).
3. Review the Action Needed tab for anything that requires your attention.
4. Use the Community tab to keep track of people you are nurturing with value content only.

---

## Next Small Improvements (Later)

- Add a column for "Last Value Touch" (e.g. Friday Moment sent, breathing video sent, etc.)
- Add a simple way to log value touches
- Connect this sheet more tightly with Layer 1 (draft generation)
- Build a phone-friendly view on top of this data

---

This setup is intentionally kept simple so you can start using it immediately with the current Jersey City beta without adding complexity you don't need yet.

When you're ready, we can expand it to support the next districts (Manhattan, etc.).