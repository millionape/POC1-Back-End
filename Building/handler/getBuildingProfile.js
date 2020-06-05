const AWS = require('aws-sdk');
const moment = require('moment');
const dynamo = new AWS.DynamoDB.DocumentClient({
    // apiVersion: '2012-08-10'
});
exports.getAllProfile = function (path_params) {
    console.log('creater id: ', path_params);
    return new Promise((resolve, reject) => {
        var params = {
            TableName: process.env.BUILDING_PROFILE_TABLE,
            FilterExpression: '#cid = :this_cid',
            ExpressionAttributeNames: {
                '#cid': 'createrId'
            },
            ExpressionAttributeValues: {
                ':this_cid': path_params.userId
            }
        };
        console.log(params);
        dynamo.scan(params, onScan);
        var count = 0;
        function onScan(err, data) {
            if (err) {
                console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Scan succeeded.");
                // data.Items.forEach(function (itemdata) {
                //     console.log("Item :", ++count, JSON.stringify(itemdata));
                // });
                resolve(data.Items);
                // continue scanning if we have more items
                if (typeof data.LastEvaluatedKey != "undefined") {
                    console.log("Scanning for more...");
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                    dynamo.scan(params, onScan);
                }
            }
        }
    });
};