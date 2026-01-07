/*
 * GOOGLE APPS SCRIPT FOR SUNBEAM INNOVX HACKATHON
 * 
 * INSTRUCTIONS:
 * 1. Go to https://script.google.com/ home
 * 2. Click "New Project"
 * 3. Paste this code into the editor (Code.gs)
 * 4. Save the project (e.g., "SunbeamHackathonBackend")
 * 5. Run the 'initialSetup' function once to create the sheet headers (Run > initialSetup)
 *    - You might need to accept permissions
 * 6. Deploy as Web App:
 *    - Click "Deploy" > "New deployment"
 *    - Select type: "Web app"
 *    - Description: "v1"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (IMPORTANT)
 *    - Click "Deploy"
 * 7. Copy the "Web app URL" and paste it into the 'script.js' file in your project 
 *    replacing 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE'.
 */

// CHANGE THIS TO YOUR GOOGLE SHEET ID
// Open your Google Sheet, copy the ID from the URL: docs.google.com/spreadsheets/d/YOUR_ID_HERE/edit
const SHEET_ID = '1kFuP4BDMzuylNJiuAu8Vy7CIhv0jwg3HgT2ih2E8NrI';
const SHEET_NAME = 'SUNBEAM_INNOVX_2026_REGISTRATIONS';

function initialSetup() {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
    }

    // Headers based on requirements
    const headers = [
        'Timestamp',
        'Full Name',
        'Class',
        'School Name',
        'Personal Email',
        'Mobile Number',
        'Generated Hackathon Email',
        'LMS Username',
        'Stage 1 Status',
        'Stage 2 Status'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
}

function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const sheet = ss.getSheetByName(SHEET_NAME);

        const timestamp = new Date();
        const data = e.parameter;

        // Generate derived fields
        // Logic: Hackathon Email = firstname.lastname.hash@sunbeamhackathon.com
        const namePart = data.fullName.toLowerCase().replace(/\s+/g, '.');
        // Simple random string for uniqueness
        const randomStr = Math.random().toString(36).substring(2, 6);
        const hackathonEmail = `${namePart}.${randomStr}@sunbeamhackathon.com`;
        const lmsUsername = `${namePart}${randomStr}`;

        // Append Row
        const nextRow = sheet.getLastRow() + 1;
        const newRow = [
            timestamp,
            data.fullName,
            data.class,
            data.schoolName,
            data.email,
            "'" + data.mobile, // Force string for phone numbers
            hackathonEmail,
            lmsUsername,
            'Pending', // Stage 1 Status
            'Pending'  // Stage 2 Status
        ];

        sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

        return ContentService
            .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (e) {
        return ContentService
            .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}
