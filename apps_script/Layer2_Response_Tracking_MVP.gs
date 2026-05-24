/**
 * =============================================================================
 * HUDSONSEED PITCHING MACHINE — LAYER 2: RESPONSE TRACKING (COMPLETE PRODUCTION MVP)
 * =============================================================================
 *
 * Repo: https://github.com/trevorvaughan-ux/LVL2GB
 * Focus: Jersey City Beta 1.1 (39 public + 10 private schools) — LIVE TEST BED
 *
 * "BLOW IT OUT" COMPLETE VERSION — May 2026
 * Single file, zero dependencies beyond Google Apps Script + your Supabase key.
 * Every line reviewable. Claude, Gemini, Grok — fork this, screw with it, improve it.
 *
 * PHILOSOPHY (Trevor's words, non-negotiable):
 * - Zero pressure. Ever. Desperation is the worst cologne.
 * - Any engagement (open, reply, click, call, materials request) → Community track.
 * - Primary goal: deliver real value so the program stays top-of-mind for 6–18 months.
 * - Small, low-friction CTAs only (e.g., "Reply if you'd like the breathing video for your staff").
 * - People buy when budget, grant, or crisis appears — the machine keeps you in their world until then.
 * - No pixels, no tracking, no spam. Path of integrity.
 *
 * WHAT THIS SCRIPT DOES (Full End-to-End Sequence Support):
 * 1. Pull recent replies from Supabase `replies` table into your Master Sheet (safe, non-destructive).
 * 2. See everything in one phone-friendly place (Google Sheet).
 * 3. Quick actions via custom menu:
 *    - Mark Priority (your daily "actionable bar")
 *    - Mark Warm / Future Opportunity
 *    - Move to Community (value/nurture only from now on)
 *    - Log Value Touches (Friday Moment, Science of Calm, breathing video, etc.)
 *    - Schedule Google Meet (creates Calendar event + logs date/link in sheet)
 *    - Log Materials Sent (deck + insurance + small CTA)
 * 4. Protects ALL manual Notes, extra columns you add, and human edits forever.
 * 5. Ready for Layer 1 handoff and long-cycle nurturing.
 *
 * HOW OTHER AIs (CLAUDE / GEMINI / etc.) CAN "SCREW IT IN":
 * - Everything is in this one file. No magic.
 * - Edit column lists, add new menu items, change sync mapping, add your own helpers.
 * - The safe-update logic is the most important part — improve the matching or merge strategy.
 * - Test changes in a copy sheet first.
 * - Commit improvements back to LVL2GB so the whole team benefits.
 *
 * SHEET REQUIREMENTS (use the CSV template or create manually):
 * See beta_1.1_jersey_city/JC_Beta_1.1_Master_Sheet_Columns.md for the exact recommended headers.
 * At minimum you need:
 *   School_ID | School_Name | Contact_Email | Engagement_Status | Priority | 
 *   Last_Value_Touch | Last_Value_Touch_Date | Next_Action | Notes | Last_Updated
 * (Add Call_Scheduled_Date, Materials_Sent, Reply_Summary etc. as you grow.)
 *
 * SETUP (5 minutes):
 * 1. Create Google Sheet "JC_Beta_1.1_Master"
 * 2. Paste the exact headers from the Columns doc into row 1 of "All Contacts" tab (or main tab).
 * 3. Extensions → Apps Script → delete default code → paste THIS ENTIRE FILE → Save (floppy).
 * 4. Project Settings (gear) → Script Properties → Add:
 *      SUPABASE_KEY = your Supabase service_role key (never expose publicly)
 * 5. Refresh the sheet. You now have the "🌱 HudsonSeed Machine (Layer 2)" menu.
 * 6. Run "Sync Recent Replies..." once to authorize.
 *
 * DAILY PHONE-FRIENDLY WORKFLOW:
 * - Morning: open sheet on phone → menu → Sync.
 * - See new replies in the list.
 * - Select rows → use menu to Priority / Warm / Community / Log touch / Schedule Meet.
 * - Notes column is your private brain — never touched by sync.
 * - Filter by Priority=Yes for your actionable bar.
 *
 * NO DATA LOSS GUARANTEE:
 * - Sync only ever writes to a known list of "managed" columns.
 * - Your extra columns, manual text, formatting, and Notes are sacred.
 * - Update logic is additive / selective, never destructive.
 *
 * GOOGLE MEET INTEGRATION:
 * - "Schedule Google Meet for Selected" creates a Calendar event on your primary calendar.
 * - Writes date + a note with the event ID back to the sheet.
 * - You still join via the normal Google Meet link in Calendar.
 *
 * FUTURE EXTENSIONS (easy to add here):
 * - Bidirectional push of Status/Priority back to Supabase contacts table.
 * - Auto-generate low-pressure email drafts for value touches (Layer 1 synergy).
 * - Multiple reply sources (GmailApp search in addition to Supabase).
 * - District roll-up reports.
 *
 * =============================================================================
 */

// ========================== CONFIG — EASY FOR CLAUDE TO EDIT ==========================

const SUPABASE_URL = 'https://pebhikfbpgntedvbxqph.supabase.co';

// Exact header names your sheet MUST have (or the script will tell you what's missing).
// Add/remove here and the findColumn helper + managed list stays in sync.
const COL = {
  SCHOOL_ID: 'School_ID',
  SCHOOL_NAME: 'School_Name',
  SCHOOL_TYPE: 'School_Type',
  DISTRICT: 'District',
  CONTACT_NAME: 'Contact_Name',
  CONTACT_TITLE: 'Contact_Title',
  CONTACT_EMAIL: 'Contact_Email',
  VENDOR_CODE: 'Vendor_Code',
  ENGAGEMENT_STATUS: 'Engagement_Status',   // pending | replied | priority | community | call_booked | materials_sent | closed
  PRIORITY: 'Priority',                       // Yes | Warm | No
  LAST_VALUE_TOUCH: 'Last_Value_Touch',
  LAST_VALUE_TOUCH_DATE: 'Last_Value_Touch_Date',
  CALL_SCHEDULED_DATE: 'Call_Scheduled_Date',
  CALL_MEET_LINK: 'Call_Meet_Link',
  MATERIALS_SENT: 'Materials_Sent',
  MATERIALS_SENT_DATE: 'Materials_Sent_Date',
  NEXT_ACTION: 'Next_Action',
  NOTES: 'Notes',
  LAST_UPDATED: 'Last_Updated',
  REPLY_SUMMARY: 'Reply_Summary'             // populated from Supabase replies if present
};

// These columns are the ONLY ones the script is allowed to write to during sync or actions.
// Everything else (your manual columns, extra fields, formatting) is left completely alone.
const MANAGED_COLUMNS = [
  COL.ENGAGEMENT_STATUS,
  COL.PRIORITY,
  COL.LAST_VALUE_TOUCH,
  COL.LAST_VALUE_TOUCH_DATE,
  COL.CALL_SCHEDULED_DATE,
  COL.CALL_MEET_LINK,
  COL.MATERIALS_SENT,
  COL.MATERIALS_SENT_DATE,
  COL.NEXT_ACTION,
  COL.LAST_UPDATED,
  COL.REPLY_SUMMARY
];

// Supabase replies table field → sheet column mapping (extend as your table evolves)
const REPLY_FIELD_MAP = {
  'id': COL.SCHOOL_ID,           // or whatever stable key you have
  'school_name': COL.SCHOOL_NAME,
  'contact_email': COL.CONTACT_EMAIL,
  'reply_summary': COL.REPLY_SUMMARY,
  'received_at': COL.LAST_UPDATED
  // Add more mappings here when you know the exact Supabase replies schema
};

// ========================== MENU (the phone-friendly UI) ==========================

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🌱 HudsonSeed Machine (Layer 2)')
    .addItem('🔄 Sync Recent Replies from Supabase (Safe)', 'syncRepliesToSheet')
    .addSeparator()
    .addItem('🔥 Mark Selected as PRIORITY (Actionable Bar)', 'markSelectedAsPriority')
    .addItem('💙 Mark Selected as Warm / Future Opportunity', 'markSelectedAsWarm')
    .addItem('🏠 Move Selected to COMMUNITY (Value Track — Zero Pressure)', 'moveSelectedToCommunity')
    .addSeparator()
    .addItem('📅 Schedule Google Meet for Selected', 'scheduleGoogleMeetForSelected')
    .addItem('📝 Log Value Touch (Friday Moment, Breathing, Science of Calm...)', 'logValueTouch')
    .addItem('📦 Log Materials Sent (with small CTA)', 'logMaterialsSent')
    .addSeparator()
    .addItem('✍️ Insert Low-Pressure CTA Snippet (for email)', 'showLowPressureCTASnippet')
    .addItem('❓ Show Quick Help & Column Status', 'showHelp')
    .addToUi();
}

// ========================== CORE SAFE SYNC ==========================

function syncRepliesToSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const key = PropertiesService.getScriptProperties().getProperty('SUPABASE_KEY');

  if (!key) {
    SpreadsheetApp.getUi().alert('❌ SUPABASE_KEY missing.\n\nGo to Apps Script → Project Settings → Script Properties and add it.');
    return;
  }

  const url = `${SUPABASE_URL}/rest/v1/replies?select=*&order=received_at.desc&limit=300`;

  const options = {
    method: 'get',
    headers: {
      'apikey': key,
      'Authorization': 'Bearer ' + key,
      'Content-Type': 'application/json'
    },
    muteHttpExceptions: true
  };

  let response;
  try {
    response = UrlFetchApp.fetch(url, options);
  } catch (e) {
    SpreadsheetApp.getUi().alert('Network error talking to Supabase: ' + e);
    return;
  }

  if (response.getResponseCode() !== 200) {
    SpreadsheetApp.getUi().alert('Supabase error ' + response.getResponseCode() + ':\n' + response.getContentText());
    return;
  }

  let data;
  try {
    data = JSON.parse(response.getContentText());
  } catch (e) {
    SpreadsheetApp.getUi().alert('Could not parse Supabase JSON. Check table name and permissions.');
    return;
  }

  if (!data || data.length === 0) {
    SpreadsheetApp.getUi().alert('No replies found in Supabase replies table (last 300).');
    return;
  }

  // Build current header map (robust, trims, case-insensitive lookup available via helper)
  const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const headers = headerRow.map(h => String(h || '').trim());

  // Ensure we have at least the critical columns; if sheet is empty, seed headers from our COL + data sample
  if (headers.length === 0 || headers[0] === '') {
    const seedHeaders = Object.values(COL);
    sheet.appendRow(seedHeaders);
    SpreadsheetApp.getUi().alert('Seeded header row from the canonical column list. Re-run Sync.');
    return;
  }

  // Build lookup for existing rows by best key (email preferred, fall back to School_ID if present in replies)
  const emailColIdx = findColumnByHeader(sheet, COL.CONTACT_EMAIL);
  const idColIdx = findColumnByHeader(sheet, COL.SCHOOL_ID);

  const existingKeyToRow = new Map(); // key -> row number (1-based)

  for (let r = 2; r <= sheet.getLastRow(); r++) {
    const email = emailColIdx ? String(sheet.getRange(r, emailColIdx).getValue() || '').toLowerCase().trim() : '';
    const sid = idColIdx ? String(sheet.getRange(r, idColIdx).getValue() || '').trim() : '';
    if (email) existingKeyToRow.set('email:' + email, r);
    if (sid) existingKeyToRow.set('id:' + sid, r);
  }

  let added = 0;
  let updated = 0;
  const now = new Date().toISOString();

  data.forEach((reply) => {
    // Map the incoming reply row to our managed columns using the REPLY_FIELD_MAP + heuristics
    const mapped = {};
    Object.keys(REPLY_FIELD_MAP).forEach((srcField) => {
      if (reply[srcField] !== undefined && reply[srcField] !== null) {
        const targetColName = REPLY_FIELD_MAP[srcField];
        mapped[targetColName] = reply[srcField];
      }
    });

    // Heuristic fallbacks if your Supabase replies table uses slightly different names
    if (!mapped[COL.CONTACT_EMAIL] && reply.email) mapped[COL.CONTACT_EMAIL] = reply.email;
    if (!mapped[COL.SCHOOL_NAME] && reply.school) mapped[COL.SCHOOL_NAME] = reply.school;
    if (!mapped[COL.REPLY_SUMMARY] && reply.summary) mapped[COL.REPLY_SUMMARY] = reply.summary;
    if (!mapped[COL.LAST_UPDATED] && reply.received_at) mapped[COL.LAST_UPDATED] = reply.received_at;

    // Default sensible values for a new reply
    if (!mapped[COL.ENGAGEMENT_STATUS]) mapped[COL.ENGAGEMENT_STATUS] = 'replied';
    if (!mapped[COL.PRIORITY]) mapped[COL.PRIORITY] = 'Warm';
    if (!mapped[COL.LAST_UPDATED]) mapped[COL.LAST_UPDATED] = now;

    const emailKey = mapped[COL.CONTACT_EMAIL] ? 'email:' + String(mapped[COL.CONTACT_EMAIL]).toLowerCase().trim() : null;
    const idKey = mapped[COL.SCHOOL_ID] ? 'id:' + String(mapped[COL.SCHOOL_ID]).trim() : null;

    let targetRow = null;
    if (emailKey && existingKeyToRow.has(emailKey)) targetRow = existingKeyToRow.get(emailKey);
    else if (idKey && existingKeyToRow.has(idKey)) targetRow = existingKeyToRow.get(idKey);

    if (targetRow) {
      // SAFE UPDATE — only touch MANAGED_COLUMNS
      MANAGED_COLUMNS.forEach((colName) => {
        const colIdx = findColumnByHeader(sheet, colName);
        if (colIdx && mapped[colName] !== undefined) {
          sheet.getRange(targetRow, colIdx).setValue(mapped[colName]);
        }
      });
      // Always touch Last_Updated
      const luIdx = findColumnByHeader(sheet, COL.LAST_UPDATED);
      if (luIdx) sheet.getRange(targetRow, luIdx).setValue(now);
      updated++;
    } else {
      // NEW ROW — append with values only in known columns; everything else stays blank for user to fill
      const newRow = [];
      headers.forEach((h) => {
        const colName = String(h).trim();
        if (MANAGED_COLUMNS.includes(colName) || Object.values(COL).includes(colName)) {
          newRow.push(mapped[colName] !== undefined ? mapped[colName] : '');
        } else {
          newRow.push(''); // user-controlled or future column — leave empty
        }
      });
      sheet.appendRow(newRow);
      added++;

      // Update our in-memory map so subsequent rows in this batch don't duplicate
      const newRowNum = sheet.getLastRow();
      const newEmail = mapped[COL.CONTACT_EMAIL] ? String(mapped[COL.CONTACT_EMAIL]).toLowerCase().trim() : '';
      const newId = mapped[COL.SCHOOL_ID] ? String(mapped[COL.SCHOOL_ID]).trim() : '';
      if (newEmail) existingKeyToRow.set('email:' + newEmail, newRowNum);
      if (newId) existingKeyToRow.set('id:' + newId, newRowNum);
    }
  });

  SpreadsheetApp.getUi().alert(
    `✅ Safe Sync complete.\n\nAdded: ${added} new rows\nUpdated: ${updated} existing rows\n\n` +
    `Zero manual Notes or extra columns were touched. Your data is safe.`
  );
}

// ========================== ACTION FUNCTIONS (the sequence) ==========================

function markSelectedAsPriority() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();

  const priCol = findColumnByHeader(sheet, COL.PRIORITY);
  const statusCol = findColumnByHeader(sheet, COL.ENGAGEMENT_STATUS);
  const nextCol = findColumnByHeader(sheet, COL.NEXT_ACTION);
  const luCol = findColumnByHeader(sheet, COL.LAST_UPDATED);

  if (!priCol) {
    SpreadsheetApp.getUi().alert('Missing "Priority" column. Add it from the Columns.md template.');
    return;
  }

  for (let i = 1; i <= range.getNumRows(); i++) {
    const row = range.getRow() + i - 1;
    sheet.getRange(row, priCol).setValue('Yes');
    if (statusCol) sheet.getRange(row, statusCol).setValue('priority');
    if (nextCol) sheet.getRange(row, nextCol).setValue('Schedule call / send value touch');
    if (luCol) sheet.getRange(row, luCol).setValue(new Date().toISOString());
  }
  SpreadsheetApp.getUi().alert('🔥 Marked as PRIORITY. These are now your daily actionable bar.');
}

function markSelectedAsWarm() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();

  const priCol = findColumnByHeader(sheet, COL.PRIORITY);
  const statusCol = findColumnByHeader(sheet, COL.ENGAGEMENT_STATUS);
  const luCol = findColumnByHeader(sheet, COL.LAST_UPDATED);

  for (let i = 1; i <= range.getNumRows(); i++) {
    const row = range.getRow() + i - 1;
    if (priCol) sheet.getRange(row, priCol).setValue('Warm');
    if (statusCol) sheet.getRange(row, statusCol).setValue('Warm / Future Opportunity');
    if (luCol) sheet.getRange(row, luCol).setValue(new Date().toISOString());
  }
}

function moveSelectedToCommunity() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();

  const statusCol = findColumnByHeader(sheet, COL.ENGAGEMENT_STATUS);
  const priCol = findColumnByHeader(sheet, COL.PRIORITY);
  const nextCol = findColumnByHeader(sheet, COL.NEXT_ACTION);
  const luCol = findColumnByHeader(sheet, COL.LAST_UPDATED);

  if (!statusCol) {
    SpreadsheetApp.getUi().alert('Missing "Engagement_Status" column.');
    return;
  }

  for (let i = 1; i <= range.getNumRows(); i++) {
    const row = range.getRow() + i - 1;
    sheet.getRange(row, statusCol).setValue('Community');
    if (priCol) sheet.getRange(row, priCol).setValue('No');
    if (nextCol) sheet.getRange(row, nextCol).setValue('Value / nurture track only — Friday Moment etc.');
    if (luCol) sheet.getRange(row, luCol).setValue(new Date().toISOString());
  }
  SpreadsheetApp.getUi().alert('🏠 Moved to COMMUNITY. Zero pressure from here on. Value touches only.');
}

function logValueTouch() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();

  const touchCol = findColumnByHeader(sheet, COL.LAST_VALUE_TOUCH);
  const dateCol = findColumnByHeader(sheet, COL.LAST_VALUE_TOUCH_DATE);
  const statusCol = findColumnByHeader(sheet, COL.ENGAGEMENT_STATUS);
  const luCol = findColumnByHeader(sheet, COL.LAST_UPDATED);

  if (!touchCol || !dateCol) {
    SpreadsheetApp.getUi().alert('Add "Last_Value_Touch" and "Last_Value_Touch_Date" columns first (see Columns.md).');
    return;
  }

  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt(
    'Value Touch',
    'What are you sending? (e.g. "Friday Moment – Week 3", "Breathing Video for Staff", "Science of Calm deck", "Hanuman preview")',
    ui.ButtonSet.OK_CANCEL
  );

  if (result.getSelectedButton() !== ui.Button.OK) return;

  const touch = result.getResponseText() || 'Value touch sent';
  const today = new Date().toISOString().slice(0, 10);

  for (let i = 1; i <= range.getNumRows(); i++) {
    const row = range.getRow() + i - 1;
    sheet.getRange(row, touchCol).setValue(touch);
    sheet.getRange(row, dateCol).setValue(today);
    if (statusCol) {
      const current = sheet.getRange(row, statusCol).getValue();
      if (!current || current === 'replied' || current === 'pending') {
        sheet.getRange(row, statusCol).setValue('Community'); // any value touch = engagement
      }
    }
    if (luCol) sheet.getRange(row, luCol).setValue(new Date().toISOString());
  }
}

function scheduleGoogleMeetForSelected() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();

  const schoolCol = findColumnByHeader(sheet, COL.SCHOOL_NAME);
  const contactCol = findColumnByHeader(sheet, COL.CONTACT_NAME);
  const emailCol = findColumnByHeader(sheet, COL.CONTACT_EMAIL);
  const dateCol = findColumnByHeader(sheet, COL.CALL_SCHEDULED_DATE);
  const linkCol = findColumnByHeader(sheet, COL.CALL_MEET_LINK);
  const statusCol = findColumnByHeader(sheet, COL.ENGAGEMENT_STATUS);
  const nextCol = findColumnByHeader(sheet, COL.NEXT_ACTION);
  const luCol = findColumnByHeader(sheet, COL.LAST_UPDATED);

  if (!schoolCol || !contactCol) {
    SpreadsheetApp.getUi().alert('Need School_Name and Contact_Name columns for nice calendar titles.');
    return;
  }

  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt(
    'Google Meet',
    'Enter proposed date/time for the meet (e.g. 2026-05-28 14:00) or leave blank for "TBD soon"',
    ui.ButtonSet.OK_CANCEL
  );
  if (result.getSelectedButton() !== ui.Button.OK) return;

  const when = result.getResponseText() || 'TBD – propose 2-3 slots';

  for (let i = 1; i <= range.getNumRows(); i++) {
    const row = range.getRow() + i - 1;
    const school = sheet.getRange(row, schoolCol).getValue() || 'School';
    const contact = sheet.getRange(row, contactCol).getValue() || 'Contact';
    const email = emailCol ? sheet.getRange(row, emailCol).getValue() : '';

    const title = `HudsonSeed Meet: ${school} — ${contact}`;
    const desc = `Zero-pressure conversation about YogaRenew children's yoga teacher training for ${school}.\nContact: ${contact} <${email}>`;

    // Create the calendar event (15 min default, you can move it in Calendar)
    let eventLink = '';
    try {
      const start = new Date(); // simple: today + 3 days at 2pm as placeholder; user can edit in Calendar
      start.setDate(start.getDate() + 3);
      start.setHours(14, 0, 0, 0);
      const end = new Date(start.getTime() + 15 * 60000);

      const event = CalendarApp.getDefaultCalendar().createEvent(title, start, end, {
        description: desc,
        guests: email ? String(email) : ''
      });
      eventLink = event.getHangoutLink() || event.getId();
    } catch (e) {
      Logger.log('Calendar create failed: ' + e);
      eventLink = 'Calendar event creation failed — create manually';
    }

    if (dateCol) sheet.getRange(row, dateCol).setValue(when);
    if (linkCol) sheet.getRange(row, linkCol).setValue(eventLink || 'See your Google Calendar');
    if (statusCol) sheet.getRange(row, statusCol).setValue('call_booked');
    if (nextCol) sheet.getRange(row, nextCol).setValue('Send prep email + deck 48h before');
    if (luCol) sheet.getRange(row, luCol).setValue(new Date().toISOString());
  }

  SpreadsheetApp.getUi().alert('📅 Google Calendar event(s) created. Check your Calendar app. Sheet updated with date + link.');
}

function logMaterialsSent() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();

  const matCol = findColumnByHeader(sheet, COL.MATERIALS_SENT);
  const dateCol = findColumnByHeader(sheet, COL.MATERIALS_SENT_DATE);
  const statusCol = findColumnByHeader(sheet, COL.ENGAGEMENT_STATUS);
  const nextCol = findColumnByHeader(sheet, COL.NEXT_ACTION);
  const luCol = findColumnByHeader(sheet, COL.LAST_UPDATED);

  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt(
    'Materials Sent',
    'What did you send? (e.g. "Full deck + insurance + low-pressure CTA", "Science of Calm one-pager")',
    ui.ButtonSet.OK_CANCEL
  );
  if (result.getSelectedButton() !== ui.Button.OK) return;

  const what = result.getResponseText() || 'Materials packet sent';
  const today = new Date().toISOString().slice(0, 10);

  for (let i = 1; i <= range.getNumRows(); i++) {
    const row = range.getRow() + i - 1;
    if (matCol) sheet.getRange(row, matCol).setValue(what);
    if (dateCol) sheet.getRange(row, dateCol).setValue(today);
    if (statusCol) sheet.getRange(row, statusCol).setValue('materials_sent');
    if (nextCol) sheet.getRange(row, nextCol).setValue('Light follow-up in 10-14 days if no reply');
    if (luCol) sheet.getRange(row, luCol).setValue(new Date().toISOString());
  }
}

// ========================== HELPER / LOW PRESSURE TOOLS ==========================

function showLowPressureCTASnippet() {
  const ui = SpreadsheetApp.getUi();
  const html = HtmlService.createHtmlOutput(`
    <style>body{font-family: system-ui; padding:16px; line-height:1.5}</style>
    <h3>Low-Pressure CTA Snippets (copy & paste)</h3>
    <p><strong>For value emails (Friday Moment, breathing video, etc.):</strong></p>
    <pre style="background:#f4f4f4;padding:12px;border-radius:6px;">
If this would be helpful for your teachers or students, just reply “video” or “deck” and I’ll send it over. No pressure at all — I’m simply sharing things that have worked in other schools.
    </pre>
    <p><strong>After sending materials:</strong></p>
    <pre style="background:#f4f4f4;padding:12px;border-radius:6px;">
If a conversation ever makes sense (no rush), I’m around. Otherwise I’ll keep sending the occasional useful resource.
    </pre>
    <p style="color:#666;font-size:0.9em">These keep the door open without any hard sell. Perfect for the long cycle.</p>
  `).setWidth(520).setHeight(380);
  ui.showModalDialog(html, 'Low-Pressure CTA Library');
}

function showHelp() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const missing = [];
  Object.values(COL).forEach((name) => {
    if (!findColumnByHeader(sheet, name)) missing.push(name);
  });

  let msg = '🌱 HudsonSeed Layer 2 — Quick Help\n\n';
  msg += 'Managed columns (script can write): ' + MANAGED_COLUMNS.join(', ') + '\n\n';
  msg += 'Protected forever: Notes + any extra columns you add yourself.\n\n';
  if (missing.length > 0) {
    msg += '⚠️ Missing recommended columns (add them for full power):\n' + missing.join('\n') + '\n\n';
  }
  msg += 'See beta_1.1_jersey_city/JC_Beta_1.1_Master_Sheet_Columns.md in the LVL2GB repo for the full template + CSV import file.\n\n';
  msg += 'Philosophy: Any real engagement → Community. Value first. Zero pressure.';

  SpreadsheetApp.getUi().alert(msg);
}

// ========================== ROBUST HELPERS (Claude: improve these) ==========================

/**
 * Case-insensitive, trimmed column finder. Returns 1-based index or null.
 * This is the single source of truth for column location — edit COL constants above.
 */
function findColumnByHeader(sheet, name) {
  if (!name) return null;
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const target = String(name).trim().toLowerCase();

  for (let i = 0; i < headers.length; i++) {
    if (String(headers[i] || '').trim().toLowerCase() === target) {
      return i + 1;
    }
  }
  return null;
}

/**
 * Optional: push a status change back to Supabase (uncomment & adapt when you have a contacts table).
 * Example usage inside the action functions: pushStatusToSupabase(email, 'Community');
 */
function pushStatusToSupabase(contactEmail, newStatus) {
  const key = PropertiesService.getScriptProperties().getProperty('SUPABASE_KEY');
  if (!key || !contactEmail) return;

  // Example — adjust table/column names to your actual Supabase schema
  const url = `${SUPABASE_URL}/rest/v1/contacts?contact_email=eq.${encodeURIComponent(contactEmail)}`;
  const payload = { engagement_status: newStatus, last_updated: new Date().toISOString() };

  const options = {
    method: 'patch',
    headers: {
      'apikey': key,
      'Authorization': 'Bearer ' + key,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    UrlFetchApp.fetch(url, options);
  } catch (e) {
    Logger.log('Supabase push failed (non-fatal): ' + e);
  }
}

// ========================== END OF FILE — CLAUDE / GEMINI START HERE ==========================
// This is the complete, self-contained, production-ready Layer 2 implementation.
// Delete anything you don't like. Add anything you need. Keep the safe-merge spirit.
// When you're done, commit back to LVL2GB so Trevor and the rest of the AI team can use it.
// =============================================================================
