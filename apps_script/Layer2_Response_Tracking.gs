/**
 * Layer 2 — Response Tracking (MVP Starter)
 *
 * This is a lightweight starting point for handling replies in the HudsonSeed Pitching Machine.
 *
 * Goals for the first version:
 * - Give Trevor a clean place to see who has replied
 * - Make it easy to flag priority leads that need calls
 * - Support moving people into "Community" (no more pitching) instead of spamming
 * - Work with Supabase as the source of truth
 * - Stay simple and maintainable
 */

// ================== CONFIG ==================
const SUPABASE_URL = 'https://pebhikfbpgntedvbxqph.supabase.co';

/**
 * Pull recent replies from Supabase and write them into the active sheet.
 * This is a starting point — we can make it smarter over time.
 */
function syncRepliesToSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  const key = PropertiesService.getScriptProperties().getProperty('SUPABASE_KEY');
  if (!key) {
    SpreadsheetApp.getUi().alert('SUPABASE_KEY not set in Script Properties');
    return;
  }

  // Example query — adjust table/fields based on your actual Supabase schema
  const url = `${SUPABASE_URL}/rest/v1/replies?select=*&order=received_at.desc&limit=100`;

  const options = {
    method: 'get',
    headers: {
      'apikey': key,
      'Authorization': 'Bearer ' + key,
      'Content-Type': 'application/json'
    },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);

  if (response.getResponseCode() !== 200) {
    SpreadsheetApp.getUi().alert('Error pulling from Supabase: ' + response.getContentText());
    return;
  }

  const data = JSON.parse(response.getContentText());

  if (!data || data.length === 0) {
    SpreadsheetApp.getUi().alert('No replies found in Supabase yet.');
    return;
  }

  // Write headers + data (simple version)
  const headers = Object.keys(data[0]);
  sheet.clearContents();
  sheet.appendRow(headers);

  const rows = data.map(row => headers.map(h => row[h] ?? ''));
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);

  SpreadsheetApp.getUi().alert(`Synced ${data.length} replies into the sheet.`);
}

/**
 * Mark a row as Priority (you can expand this later with buttons, menus, etc.)
 */
function markSelectedAsPriority() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();

  // Simple example: set column "Priority" to Yes for selected rows
  // You can make this much nicer later with a menu or buttons.
  const priorityCol = 9; // Adjust based on your actual column order

  for (let i = 1; i <= range.getNumRows(); i++) {
    sheet.getRange(range.getRow() + i - 1, priorityCol).setValue('Yes');
  }
}

/**
 * Move selected contacts to Community (stop pitching them)
 */
function moveSelectedToCommunity() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();

  const statusCol = 10; // Adjust to match your sheet

  for (let i = 1; i <= range.getNumRows(); i++) {
    sheet.getRange(range.getRow() + i - 1, statusCol).setValue('Community');
  }
}
