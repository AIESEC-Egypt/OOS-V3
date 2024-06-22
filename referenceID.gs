function checkReferenceID_GV() {
  const mails = gvSheet
    .getRange("D4:D" + lastRow)
    .getValues()
    .flat();
  const names = gvSheet
    .getRange("C4:C" + lastRow)
    .getValues()
    .flat();
  var formID = gvSheet.getRange("H4:H").getValue(); // Assuming the form ID is in cell H2
  var oppID = gvSheet.getRange("A4:A").getValue();

  var contractID = contractSystem_GV.getRange("BQ2:BQ" + lastRow).getValues(); // Get only the IDs from "contract system"
  var rowData;
  var found = false;

  // Loop through the contract data to find a match
  for (var i = 0; i < contractID.length; i++) {
    if (contractID[i][0] == formID) {
      found = true;
      rowData = contractSystem_GV
        .getRange("A" + (i + 2) + ":BQ" + (i + 2))
        .getValues()[0]; // Get the entire row for the matched ID
      gvSheet.getRange("J" + (i + 4) + ":BZ" + (i + 4)).setValues([rowData]);
      break;
    }
  }

  if (!found) {
    // If not found, send emails
    for (var i = 0; i < mails.length; i++) {
      var mail = mails[i].toString().trim();
      if (mail != "") {
        var name = names[i];
        var subject = "Your Opportunity Got Closed - Opportunity ID " + oppID;
        var message =
          "Dear " +
          name +
          ",\nYour Opportunity that has this ID " +
          oppID +
          " got closed because it doesn't have a generated contract or you entered a wrong reference ID.";
        MailApp.sendEmail(mail, subject, message);
        Logger.log("sent");
      }
    }
  }
}
