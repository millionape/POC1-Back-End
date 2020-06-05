const AWS = require('aws-sdk');
const moment = require('moment');
const dynamo = new AWS.DynamoDB.DocumentClient({
    // apiVersion: '2012-08-10'
});

exports.create = function (body) {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: process.env.BUILDING_PROFILE_TABLE,
            Item: {
                areaList: body.profileArea,
                buildingId: body.profileInformation.buildingId,
                buildingName: "null",
                buildingProfileId: body.profileInformation.profileId,
                buildingProfileName: body.profileInformation.profileName,
                createdDate: moment().format(),
                description: body.profileInformation.description,
                deviceIds: body.profileInformation.edgeIds,
                deviceName: "null",
                updatedDate: moment().format(),
                collaborators: body.collaborators,
                creater: body.creater,
                createrId: body.createrId
            }
        };
        console.log(params);
        // resolve(response_msg);
        dynamo.put(params, function (err, data) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log("UPDATE SUCCESS");
                resolve(data);
            }
        });
    });
}