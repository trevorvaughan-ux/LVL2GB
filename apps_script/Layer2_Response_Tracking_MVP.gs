/**
 * Layer 2 — Response Tracking (MVP + Antifragile)
 *
 * Design goals:
 * - MVP first: Only what’s needed to run real response handling on the current beta
 * - Antifragile: Never destroy manual work in the sheet
 * - Safe: Clear errors, good logging, defensive coding
 * - Usable: Custom menu + simple functions
 *
 * This is designed to work alongside your existing Layer 1 in the same Google Sheet workbook.
 */

const SUPABASE_URL = 'https://pebhikfbpgntedvbxqph.supabase.co';

/**
 * Creates the custom menu when the sheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🌱 HudsonSeed Machine (Layer 2)')
    .addItem('🔄 Sync Recent Replies from Supabase', 'syncRepliesToSheet')
    .addSeparator()
    .addItem('🔥 Mark Selected as Priority', 'markSelectedAsPriority')
    .addItem('🏛️ Move Selected to Community (No More Pitching)', 'moveSelectedToCommunity')
    .addToUi();
}

/**
 * Main sync function.
 * Pulls recent replies from Supabase and merges them safely into the sheet.
 * Never overwrites manual notes or extra columns.
 */
function syncRepliesToSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const key = PropertiesService.getScriptProperties().getProperty('SUPABASE_KEY');

  if (!key) {
    SpreadsheetApp.getUi().alert('❌ Error: SUPABASE_KEY is missing. Add it in Project Settings → Script Properties.');
    return;
  }

  // --- Pull data from Supabase ---
  const url = `${SUPABASE_URL}/rest/v1/replies?select=*&order=received_at.desc&limit=200`;

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
    SpreadsheetApp.getUi().alert('Supabase error: ' + response.getContentText());
    return;
  }

  let data;
  try {
    data = JSON.parse(response.getContentText());
  } catch (e) {
    SpreadsheetApp.getUi().alert('Failed to parse Supabase response. Is it returning valid JSON?');
    return;
  }

  if (!data || data.length === 0) {
    SpreadsheetApp.getUi().alert('No recent replies found in Supabase.');
    return;
  }

  // --- Read existing sheet structure ---
  const lastCol = sheet.getLastColumn();
  const lastRow = sheet.getLastRow();

  let headers = [];
  if (lastRow >= 1) {
    headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  }

  // If sheet is empty, bootstrap with the keys from the first Supabase row
  if (headers.length === 0 || headers[0] === '') {
    headers = Object.keys(data[0]);
    sheet.appendRow(headers);
    // Re-read headers after writing them
    headers = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  }

  // Build a map of existing IDs (we assume column 1 or a column named "id" is the primary key)
  const idColumnIndex = headers.indexOf('id');
  const existingIds = new Set();

  if (lastRow > 1 && idColumnIndex !== -1) {
    const idValues = sheet.getRange(2, idColumnIndex + 1, lastRow - 1, 1).getValues();
    idValues.forEach(row => {
      if (row[0]) existingIds.add(row[0].toString());
    });
  }

  let newRowsAdded = 0;
  let rowsUpdated = 0;

  data.forEach(dbRow => {
    const dbId = dbRow.id ? dbRow.id.toString() : '';

    // Build a row that matches the current sheet headers
    const formattedRow = headers.map(header => {
      return dbRow.hasOwnProperty(header) ? dbRow[header] : '';
    });

    if (dbId && existingIds.has(dbId)) {
      // Update existing row in place (only fields that came from Supabase)
      const rowIndex = Array.from(existingIds).indexOf(dbId) + 2; // +2 because of header + 1-based indexing

      headers.forEach((header, colIndex) => {
        if (dbRow.hasOwnProperty(header)) {
          sheet.getRange(rowIndex, colIndex + 1).setValue(dbRow[header]);
        }
      });
      rowsUpdated++;
    } else {
      // New row — append at the bottom
      sheet.appendRow(formattedRow);
      if (dbId) existingIds.add(dbId);
      newRowsAdded++;
    }
  });

  SpreadsheetApp.getUi().alert(`✅ Sync complete.
New replies added: ${newRowsAdded}
Existing rows updated: ${rowsUpdated}`);
}

/**
 * Marks the selected rows as Priority.
 * Looks for a column named "Priority".
 */
function markSelectedAsPriority() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();
  const priorityCol = findColumnByHeader(sheet, 'Priority');

  if (!priorityCol) {
    SpreadsheetApp.getUi().alert('❌ Error: Could not find a column named "Priority" in row 1.');
    return;
  }

  for (let i = 1; i <= range.getNumRows(); i++) {
    sheet.getRange(range.getRow() + i - 1, priorityCol).setValue('Yes');
  }
}

/**
 * Moves selected rows to Community status (they stop receiving direct sales pitches).
 */
function moveSelectedToCommunity() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();
  const statusCol = findColumnByHeader(sheet, 'Status');

  if (!statusCol) {
    SpreadsheetApp.getUi().alert('❌ Error: Could not find a column named "Status" in row 1.');
    return;
  }

  for (let i = 1; i <= range.getNumRows(); i++) {
    sheet.getRange(range.getRow() + i - 1, statusCol).setValue('Community');
  }
}

/**
 * Helper: Find column number by header name (1-based).
 */
function findColumnByHeader(sheet, name) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const index = headers.indexOf(name);
  return index !== -1 ? index + 1 : null;
}
