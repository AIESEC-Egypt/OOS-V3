function dataUpdatingGV() {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("iGV Slots");
  var sheetData = sheet.getRange(1, 13, sheet.getLastRow(), 1).getValues();
  var sheetFlatData = sheetData.flat(1);
  var query = `query {
    opportunities(
        filters:{
          date_opened: {from : \"2024-01-01\"},
            programmes:[7],
            committee:1609,
        }
        per_page:4000
    )
    {
        paging {
            total_items
        }
        data {
            person {
                accepted_count
            }
            id
            logistics_info {
                accommodation_covered
                accommodation_provided
                computer_provided
                food_covered
                food_provided
                transportation_covered
                transportation_provided
            }
            title
            branch {
                company {
                    name
                }
            }
            programme {
                short_name_display
            }
            home_lc {
                name
            }
            status
            created_at
            date_opened
            applicants_count
            accepted_count
            slots {
                id
                status
                created_at
                openings
                available_openings
                start_date
                end_date
            }
            available_slots {
                id
            }
        }
    }
}`;

  var data = dataExtraction(query);
  for (let i = 0; i < data.length; i++) {
    sheet
      .getRange(2, 1, sheet.getLastRow() - 2 + 1, sheet.getLastColumn())
      .sort([{ column: 1, ascending: false }]);

    for (let j = 0; j < data[i].slots.length; j++) {
      var rowIndex = sheetFlatData.indexOf(parseInt(data[i].slots[j].id));
      if (rowIndex == -1) {
        Logger.log("new");
        Logger.log(data[i].id);
        var newRows = [];
        newRows.push([
          data[i].id,
          data[i].title,
          "https://aiesec.org/opportunity/global-volunteer/" + data[i].id,
          data[i].branch.company.name,
          data[i].programme.short_name_display,
          data[i].home_lc.name,
          data[i].status,
          data[i].created_at != null
            ? data[i].created_at.toString().substring(0, 10)
            : "-",
          data[i].date_opened != null
            ? data[i].date_opened.toString().substring(0, 10)
            : "-",
          data[i].applicants_count,
          data[i].slots.length,
          data[i].available_slots.length,
          data[i].slots[j].id,
          data[i].slots[j].status,
          data[i].slots[j].created_at != null
            ? data[i].slots[j].created_at.toString().substring(0, 10)
            : "-",
          data[i].slots[j].openings,
          data[i].slots[j].available_openings,
          data[i].slots[j].start_date,
          data[i].slots[j].end_date,
          data[i].logistics_info.computer_provided.replace("_", " "),
          data[i].logistics_info.accommodation_covered.replace("_", " ") +
            " & " +
            data[i].logistics_info.accommodation_provided.replace("_", " "),
          data[i].logistics_info.food_covered.replace("_", " ") +
            " & " +
            data[i].logistics_info.food_provided.replace("_", " "),
          data[i].logistics_info.transportation_covered.replace("_", " ") +
            " & " +
            data[i].logistics_info.transportation_provided.replace("_", " "),
        ]);
        sheet
          .getRange(
            sheet.getLastRow() + 1,
            1,
            newRows.length,
            newRows[0].length
          )
          .setValues(newRows);
      } else {
        Logger.log("old");
        Logger.log(data[i].id);
        var row = [];
        row.push([
          data[i].id,
          data[i].title,
          "https://aiesec.org/opportunity/global-volunteer/" + data[i].id,
          data[i].branch.company.name,
          data[i].programme.short_name_display,
          data[i].home_lc.name,
          data[i].status,
          data[i].created_at != null
            ? data[i].created_at.toString().substring(0, 10)
            : "-",
          data[i].date_opened != null
            ? data[i].date_opened.toString().substring(0, 10)
            : "-",
          data[i].applicants_count,
          data[i].slots.length,
          data[i].available_slots.length,
          data[i].slots[j].id,
          data[i].slots[j].status,
          data[i].slots[j].created_at != null
            ? data[i].slots[j].created_at.toString().substring(0, 10)
            : "-",
          data[i].slots[j].openings,
          data[i].slots[j].available_openings,
          data[i].slots[j].start_date,
          data[i].slots[j].end_date,
          data[i].logistics_info.computer_provided.replace("_", " "),
          data[i].logistics_info.accommodation_covered.replace("_", " ") +
            " & " +
            data[i].logistics_info.accommodation_provided.replace("_", " "),
          data[i].logistics_info.food_covered.replace("_", " ") +
            " & " +
            data[i].logistics_info.food_provided.replace("_", " "),
          data[i].logistics_info.transportation_covered.replace("_", " ") +
            " & " +
            data[i].logistics_info.transportation_provided.replace("_", " "),
        ]);
        sheet
          .getRange(rowIndex + 1, 1, row.length, row[0].length)
          .setValues(row);
      }
    }
  }
}
