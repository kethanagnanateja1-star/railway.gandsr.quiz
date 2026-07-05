function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Enterprise Proctored Examination')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function saveQuizResult(userData) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Enterprise_Results");
    
    if (!sheet) {
      sheet = ss.insertSheet("Enterprise_Results");
      sheet.appendRow([
        "Timestamp", "Candidate Name", "Phone", "Status", "Score", 
        "Correct", "Wrong", "Unanswered", "Warnings Issued", 
        "Avg Time/Question (sec)", "Category Breakdown", "Detailed Log"
      ]);
      sheet.getRange(1, 1, 1, 12).setFontWeight("bold").setBackground("#1e293b").setFontColor("white");
      sheet.setFrozenRows(1);
    }
    
    sheet.appendRow([
      new Date(),
      userData.name,
      "'" + userData.phone,
      userData.forcedSubmit ? "Force Submitted (Cheat)" : "Completed Normally",
      userData.score,
      userData.correct,
      userData.wrong,
      userData.unanswered,
      userData.warnings,
      userData.avgTime,
      JSON.stringify(userData.categoryScores),
      JSON.stringify(userData.detailedLog)
    ]);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}