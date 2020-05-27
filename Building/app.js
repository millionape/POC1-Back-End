'use strict';
const createBuilding = require("./handler/createBuildingProfile");
const getBuildingProfile = require("./handler/getBuildingProfile");
module.exports.router = async (event, context, callback) => {
  const url_path = event.path.split('/')[1];
  const path_params = event.pathParameters;
  const query_string_params = event.queryStringParameters;
  var body = JSON.parse(event.body);
  var response_msg = {
    status: "OK",
    message: "",
    result: ""
  };
  console.log('query string :', query_string_params);
  console.log('path params :', path_params);
  console.log('body :', body);

  if (event.httpMethod === 'POST') {
    if (url_path === 'createProfile') {
      response_msg.message = await createBuilding.create(body);
    }
  } else if (event.httpMethod === 'GET') {
    if (url_path === 'getAllProfile') {
      response_msg.message = getBuildingProfile.getAllProfile(path_params);
    }
  } else {
    response_msg.status = "error";
    response_msg.message = "no handler for GET method";
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify(response_msg),
  };
  callback(null, response);
};