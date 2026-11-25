// Paste the deployed Google Apps Script web app URL here (see README/setup notes).
const SHEET_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbwt1TpccaA_6mdNuHvSk0J_WNgofGvB48vsrlweh-BGa30W1tjzRpTN8rIOsyk4uM67/exec";

export function logResponse(type, value) {
  if (!SHEET_WEBHOOK_URL.startsWith("http")) return;
  fetch(SHEET_WEBHOOK_URL, {
    method: "POST",
    body: JSON.stringify({ type, value }),
  }).catch(() => {});
}
