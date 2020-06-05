'use strict';
const createAndUpdateGroup = require('./handler/createAndUpdateGroup');
const getGroup = require('./handler/getGroups');
const removeUser = require('./handler/removeUserFromGroup');
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
    if (url_path === 'createGroup') {
      response_msg.result = await createAndUpdateGroup.create(body);
    }else if(url_path === 'addUserToGroup'){
      response_msg.result = await createAndUpdateGroup.update(body);
    }else if(url_path === 'removeUserFromGroup'){
      response_msg.result = await removeUser.remove(body);
    }
  }else{
    if (url_path === 'getGroups'){
      response_msg.result = await getGroup.getAll();
    }
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify(response_msg),
  };
  callback(null, response);
};