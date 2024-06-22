const graphqlEndpoint = "https://gis-api.aiesec.org/graphql?access_token=";
const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
const auditingTab = spreadsheet.getSheetByName("auditing");
const igvslots = spreadsheet.getSheetByName("iGV Slots");
const gvSheet = spreadsheet.getSheetByName("iGV Submissions DB");
const contractSystem_GV = spreadsheet.getSheetByName("Contract System");
const lastRow = auditingTab.getLastRow();
const ids = auditingTab
  .getRange("C2:C" + lastRow)
  .getValues()
  .flat();
const mcAudit = auditingTab
  .getRange("B2:B" + lastRow)
  .getValues()
  .flat();
const ecbAudit = auditingTab
  .getRange("C2:C" + lastRow)
  .getValues()
  .flat();
const status = auditingTab
  .getRange("A2:A" + lastRow)
  .getValues()
  .flat();
