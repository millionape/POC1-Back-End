const AWS = require('aws-sdk');
const moment = require('moment');
var _ = require('lodash');
const dynamo = new AWS.DynamoDB.DocumentClient({
    // apiVersion: '2012-08-10'
});

function getUserList(groupId) {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: process.env.GROUP_TABLE,
            Key: {
                'groupId': groupId
            },
            ProjectionExpression: 'usersList'
        };
        dynamo.get(params, function (err, data) {
            if (err) {
                console.log("Error", err);
                reject(err);
            } else {
                console.log("Success", data);
                resolve(data.Item.usersList);
            }
        });
    });
}
exports.create = function (body) {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: process.env.GROUP_TABLE,
            Item: {
                groupId: body.groupId,
                groupName: body.groupName,
                updatedDate: moment().utc().format(),
                email: body.email,
                users: null
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

function updateUserInfo(user, group) {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: process.env.USER_INFO_TABLE,
            Key: {
                'userId': user.Username
            },
            ProjectionExpression: 'groupIdList'
        };
        dynamo.get(params, function (err, data) {
            if (err) {
                console.log("Error", err);
                reject(err);
            } else {
                console.log("Success >>>>>", data.Item.groupIdList, group);
                var groupIdList = _.uniq(data.Item.groupIdList);
                groupIdList = _.union(groupIdList, [group]);
                console.log('modified list >>>>', groupIdList);
                var params_2 = {
                    TableName: process.env.USER_INFO_TABLE,
                    Key: {
                        "userId": user.Username,
                    },
                    UpdateExpression: "set groupIdList = :g, updatedDate = :dt",
                    ExpressionAttributeValues: {
                        ":g": groupIdList,
                        ":dt": moment().utc().format()
                    },
                    ReturnValues: "UPDATED_NEW"
                };
                dynamo.update(params_2, function (err, data) {
                    if (err) {
                        console.log("Error", err);
                        reject(err);
                    } else {
                        console.log("UPDATE_SUCCESS");
                        resolve(data);
                    }
                });
            }
        });
        // var params = {
        //     TableName: process.env.USER_INFO_TABLE,
        //     Key: {
        //         userId: user.Username
        //     },
        //     ReturnValues: 'ALL_NEW',
        //     UpdateExpression: 'set #glist = list_append(if_not_exists(#glist, :empty_list), :group), #email = :e, #dt = :d',
        //     ExpressionAttributeNames: {
        //         '#glist': 'groupIdList',
        //         '#email': 'email',
        //         '#dt': 'updatedDate'
        //     },
        //     ExpressionAttributeValues: {
        //         ':group': [group],
        //         ':empty_list': [],
        //         ':e': user.Email,
        //         ':d': moment().utc().format()
        //     }
        // };
        // console.log(params);
        // // resolve(response_msg);
        // dynamo.update(params, function (err, data) {
        //     if (err) {
        //         console.log(err);
        //         reject(err);
        //     } else {
        //         console.log("UPDATE SUCCESS");
        //         resolve(data);
        //     }
        // });
    });
}

function updateUserList(groupId, userList) {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: process.env.GROUP_TABLE,
            Key: {
                "groupId": groupId,
            },
            UpdateExpression: "set usersList = :u, updatedDate = :dt",
            ExpressionAttributeValues: {
                ":u": userList,
                ":dt": moment().utc().format()
            },
            ReturnValues: "UPDATED_NEW"
        };
        console.log(params);
        // resolve(response_msg);
        dynamo.update(params, function (err, data) {
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
exports.update = async function (body) {
    let userList = await getUserList(body.groupId);
    var newUserList = _.unionBy(userList, body.users, 'Username');
    let updateRes = await updateUserList(body.groupId, newUserList);
    console.log('group table update res ==>', updateRes);
    for (var user of newUserList) {
        let userUpdateRes = await updateUserInfo(user, body.groupId);
        console.log('user info update res ===> ', user.Email, " ", userUpdateRes);
    }
    return "OK";
}