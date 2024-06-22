function approvalsCount() {
  const apd_sheet = SpreadsheetApp.openById(
    "1_JbN517SC1tRVjeCOcz44rDLQMJhdGAEnLUC404ghSI"
  ).getSheetByName("IGV");
  var oppID = gvSheet.getRange(4, 1, gvSheet.getLastRow(), 1).getValues();
  var apds_ids = apd_sheet
    .getRange(2, 1, apd_sheet.getLastRow(), 1)
    .getValues();
  var apds_status = apd_sheet
    .getRange(2, 3, apd_sheet.getLastRow(), 1)
    .getValues();
  for (let i = 0; i < oppID.length; i++) {
    let count = 0;
    for (let j = 0; j < apds_ids.length; j++) {
      let apd_id = apds_ids[j][0].split("_")[1];
      if (
        apd_id == oppID[i][0] &&
        (apds_status[i][0] != "approval_broken" ||
          apds_status[i][0] != "rejected")
      )
        count++;
    }
    gvSheet.getRange(i + 4, 81, 1, 1).setValue(count);
    Logger.log(count);
  }
}
