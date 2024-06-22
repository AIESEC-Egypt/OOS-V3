const access_token = "";

function dataExtraction(graphql) {
  var graphql = JSON.stringify({ query: graphql });
  var requestOptions = {
    method: "post",
    payload: graphql,
    contentType: "application/json",
    headers: {
      access_token: `${access_token}`,
    },
  };
  var response = UrlFetchApp.fetch(
    `https://gis-api.aiesec.org/graphql?access_token=${requestOptions["headers"]["access_token"]}`,
    requestOptions
  );
  var recievedDate = JSON.parse(response.getContentText());
  return recievedDate.data.opportunities.data;
}
