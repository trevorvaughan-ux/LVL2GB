/**
 * Layer 2 — Response Tracking (MVP + Antifragile) — Zero Pressure Version
 *
 * Philosophy:
 * - Once someone engages (opens or replies), they move into Community / Nurture.
 * - No pressure selling. Focus on giving value and staying top of mind.
 * - Small CTAs only (never verbal pushing).
 * - Long-term relationship play: they might buy in 6, 12, or 18 months when budget/grant appears.
 *
 * Core goals for MVP:
 * - See who has replied or engaged
 * - Easily move people into Community status
 * - Track light value touches and next actions
 * - Protect manual notes and custom work in the sheet
 */

const SUPABASE_URL = 'https://pebhikfbpgntedvbxqph.supabase.co';

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🌱 HudsonSeed Machine (Layer 2)')
    .addItem('🔄 Sync Recent Replies from Supabase', 'syncRepliesToSheet')
    .addSeparator()
    .addItem('🏛️ Move Selected to Community (No Pressure)', 'moveSelectedToCommunity')
    .addItem('🔥 Mark Selected as Warm / Future Opportunity', 'markSelectedAsWarm')
    .addToUi();
}

function syncRepliesToSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const key = PropertiesService.getScriptProperties().getProperty('SUPABASE_KEY');

  if (!key) {
    SpreadsheetApp.getUi().alert('❌ Error: SUPABASE_KEY is missing in Script Properties.');
    return;
  }

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
    SpreadsheetApp.getUi().alert('Network error: ' + e);
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
    SpreadsheetApp.getUi().alert('Failed to parse response from Supabase.');
    return;
  }

  if (!data || data.length === 0) {
    SpreadsheetApp.getUi().alert('No recent replies found.');
    return;
  }

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  let headers = [];
  if (lastRow >= 1) {
    headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  }

  if (headers.length === 0 || headers[0] === '') {
    headers = Object.keys(data[0]);
    sheet.appendRow(headers);
    syncRepliesToSheet();
    return;
  }

  const idCol = headers.indexOf('id');
  const existingIds = new Set();

  if (lastRow > 1 && idCol !== -1) {
    const ids = sheet.getRange(2, idCol + 1, lastRow - 1, 1).getValues();
    ids.forEach(r => { if (r[0]) existingIds.add(r[0].toString()); });
  }

  let added = 0;
  let updated = 0;

  data.forEach(dbRow => {
    const dbId = dbRow.id ? dbRow.id.toString() : '';
    const formattedRow = headers.map(h => dbRow[h] !== undefined ? dbRow[h] : '');

    if (dbId && existingIds.has(dbId)) {
      const rowIndex = Array.from(existingIds).indexOf(dbId) + 2;
      headers.forEach((h, i) => {
        if (dbRow[h] !== undefined) {
          sheet.getRange(rowIndex, i + 1).setValue(dbRow[h]);
        }
      });
      updated++;
    } else {
      sheet.appendRow(formattedRow);
      if (dbId) existingIds.add(dbId);
      added++;
    }
  });

  SpreadsheetApp.getUi().alert(`✅ Sync complete. Added ${added} new, updated ${updated} existing. All manual notes preserved.`);
}

function moveSelectedToCommunity() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();
  const statusCol = findColumnByHeader(sheet, 'Status');

  if (!statusCol) {
    SpreadsheetApp.getUi().alert('❌ Could not find a column named "Status" in row 1.');
    return;
  }

  for (let i = 1; i <= range.getNumRows(); i++) {
    sheet.getRange(range.getRow() + i - 1, statusCol).setValue('Community');
  }
}

function markSelectedAsWarm() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();
  const statusCol = findColumnByHeader(sheet, 'Status');

  if (!statusCol) {
    SpreadsheetApp.getUi().alert('❌ Could not find a column named "Status" in row 1.');
    return;
  }

  for (let i = 1; i <= range.getNumRows(); i++) {
    sheet.getRange(range.getRow() + i - 1, statusCol).setValue('Warm / Future Opportunity');
  }
}

function findColumnByHeader(sheet, name) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idx = headers.indexOf(name);
  return idx !== -1 ? idx + 1 : null;
}
