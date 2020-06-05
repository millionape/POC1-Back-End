const AWS = require('aws-sdk');
const moment = require('moment');

AWS.config.update({
    region: "ap-southeast-1",
});

exports.getUsers = function () {
    return new Promise((resolve, reject) => {
        var params = {
            UserPoolId: "ap-southeast-1_dWFvP33k6",
            AttributesToGet: ['email'],
        };
        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
        cognitoidentityserviceprovider.listUsers(params, (err, data) => {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                console.log("data", data);
                resolve(data);
            }
        });
    });
}