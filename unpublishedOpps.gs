function checkCondition() {
  var apds = gvSheet.getRange("CC4:CC" + lastRow).getValues();
  var opens = gvSheet.getRange("CB4:CB" + lastRow).getValues();
  var ids = gvSheet.getRange("A4:A" + lastRow).getValues();
  var mails = gvSheet
    .getRange("D4:D" + lastRow)
    .getValues()
    .flat();
  var names = gvSheet
    .getRange("C4:C" + lastRow)
    .getValues()
    .flat();
  var fulfilled = gvSheet.getRange("CD4:CD" + lastRow).getValues();
  const opportunitiesToUnpublish = [];
  for (let j = 0; j < ids.length; j++) {
    if (apds[j] >= opens[j] && fulfilled[j] == "") {
      rowindex = j + 4;
      unpublishOpportunityFromSheet(
        ids[j][0],
        mails[j],
        names[j],
        opportunitiesToUnpublish,
        rowindex
      );
    } else return;
  }
}
function unpublishOpportunityFromSheet(
  id,
  email,
  name,
  opportunitiesToUnpublish
) {
  try {
    Logger.log(id);
    const requestBody = {
      query: `
            mutation UnpublishOpportunity($id: ID!) {
              unpublishOpportunity(id: $id) {
               accepted_count
               applicants_count
               application_processing_time
              applications_close_date
              applications_status_facets
              applied_to
              applied_to_with
              available_openings
              average_nps_score
              company_description
              completeness
              cover_photo
              created_at
              current_status
              date_opened
              description
              duration
              earliest_start_date
              experience_type
              external_opportunity_id
              external_opportunity_link
              fee_and_health_insurance
              google_place_id
              has_opportunity_applications
              has_opportunity_questions
              id
              is_favourited
              is_gep
              is_global_project
              is_project_enabled
              lat
              latest_end_date
              lng
              location
              mandatory_fields_check
              nps_score
              office_footfall_for_exchange
              openings
              opportunity_cost
              partner_type
              percentage_of_fulfillment
              profile_photo
              programme_fees
              progress_percentage_for_standards
              project_description
              project_duration
              project_fee
              project_id
              project_name
              redirect_to_external_opportunity
              rejected_count
              remark
              remote_experience_additional_details
              remote_experience_duration
              remote_experience_salary
              remote_opportunity
              reviews
              status
              template_opportunities_locations
              title
              updated_at
              video_url
              view_count
              work_hours
              }
            }
          `,
      variables: { id },
    };

    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(requestBody),
      headers: {
        access_token: access_token,
      },
    };

    const response = UrlFetchApp.fetch(graphqlEndpoint, options);
    const responseData = JSON.parse(response.getContentText());

    if (response.getResponseCode() === 200) {
      opportunitiesToUnpublish.push(responseData.data.unpublishOpportunity);
      gvSheet.getRange(rowindex, 82).setValue("True");
      var subject = "Opportunity Unpublished!";
      var body =
        "Dear " +
        name +
        ",<br><br>Your Opportunity that has this ID" +
        id +
        " <b><span style='font-size: 14pt;'>got unpublished</span> becuase it's fulfilled with its number of APDs!";
      // Send the email
      MailApp.sendEmail(email, subject, body, { htmlBody: body });

      // Log a message to confirm that the script was triggered
      Logger.log("Email sent to " + email);
    } else {
      console.error("Error:", responseData);
    }

    return opportunitiesToUnpublish;
  } catch (error) {
    console.error("Failed to unpublish opportunities:", error);
    throw error;
  }
}
