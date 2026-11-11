// Google Apps Script for the webinar registrations sheet.
// Paste into the sheet via Extensions → Apps Script, then Deploy → New deployment →
// Web app (Execute as: Me, Who has access: Anyone). Put the web app URL in Vercel
// as GOOGLE_SHEET_WEBHOOK_URL. The site's /api/register route posts each sign-up here.

const SHEET_NAME = "Registrations";
const HEADERS = ["Timestamp", "First Name", "Last Name", "Email", "Country", "Phone", "SMS Consent", "UTM Source", "UTM Medium", "UTM Campaign", "UTM Content", "Page URL"];

// Stop values like "=..." or "+1 234" from being treated as formulas.
function safe(value) {
  const text = value == null ? "" : String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([
      new Date(),
      safe(d.first_name), safe(d.last_name), safe(d.email), safe(d.country), safe(d.phone),
      d.sms_consent ? "Yes" : "No",
      safe(d.utm_source), safe(d.utm_medium), safe(d.utm_campaign), safe(d.utm_content), safe(d.page_url),
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
