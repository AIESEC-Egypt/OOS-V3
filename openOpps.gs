// Define the GraphQL mutation function
function openOpportunityFromSheet() {
  const mails = auditingTab
    .getRange("G2:G" + lastRow)
    .getValues()
    .flat();
  const names = auditingTab
    .getRange("F2:F" + lastRow)
    .getValues()
    .flat();
  try {
    const opportunitiesToUnpublish = [];
    var live = [];

    for (let i = 0; i < ids.length; i++) {
      if (
        mcAudit[i] === "Passed" &&
        ecbAudit[i] === "Passed" &&
        (status[i] === "" || status[i] == "False") &&
        ids[i]
      ) {
        const id = ids[i];
        Logger.log(id);
        const requestBody = {
          query: `
            mutation OpenOpportunity($id: ID!) {
    openOpportunity(id: $id) {
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
          live.push(["True"]);
          sheet.getRange(3, 1, live.length, 1).setValues(live);
          var email = mails[i];
          var name = names[i];
          var subject = "Opportunity is Live!";
          var body =
            "Dear " +
            name +
            ",<br><br>Your Opportunity that has this ID" +
            id +
            " <b><span style='font-size: 14pt;'>is LIVE now</span><b> Now it's time for some APDs and Realizations!!";
          // Send the email
          MailApp.sendEmail(email, subject, body, { htmlBody: body });

          // Log a message to confirm that the script was triggered
          Logger.log("Email sent to " + email);
        } else {
          console.error("Error:", responseData);
        }
      } else if (
        mcAudit[i] === "Not Passed" &&
        ecbAudit[i] === "Not Passed" &&
        status[i] === "" &&
        ids[i]
      ) {
        sheet.getRange(3, 1, live.length, 1).setValues("Not Published");
        var email = mails[i];
        var name = names[i];
        var subject = "Opportunity hasn't been published!";
        var body =
          "Dear " +
          name +
          ",<br><br>Unfortunately, Your Opportunity that has this ID" +
          id +
          " <b><span style='font-size: 14pt;'>is not published</span><b><br> Please Review it with your MCVP/EDT again!";
        // Send the email
        MailApp.sendEmail(email, subject, body, { htmlBody: body });

        // Log a message to confirm that the script was triggered
        Logger.log("Email sent to " + email);
      }
    }

    return opportunitiesToUnpublish;
  } catch (error) {
    console.error("Failed to unpublish opportunities:", error);
    throw error;
  }
}
