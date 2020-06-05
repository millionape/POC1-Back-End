const AWS = require('aws-sdk');
const moment = require('moment');
const dynamo = new AWS.DynamoDB.DocumentClient({
    // apiVersion: '2012-08-10'
});
function getUserList(groupId){
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
function getGroupIdListFromUser(userId){
    return new Promise((resolve, reject) => {
        var params = {
            TableName: process.env.USER_INFO_TABLE,
            Key: {
                'userId': userId
            },
            ProjectionExpression: 'groupIdList'
        };
        dynamo.get(params, function (err, data) {
            if (err) {
                console.log("Error", err);
                reject(err);
            } else {
                console.log("Success", data);
                resolve(data.Item.groupIdList);
            }
        });
    });
}
function updateUserList(groupId,userList){
    return new Promise((resolve, reject) => {
        var params = {
            TableName: process.env.GROUP_TABLE,
            Key:{
                "groupId": groupId,
            },
            UpdateExpression: "set usersList = :u, updatedDate = :dt",
            ExpressionAttributeValues:{
                ":u": userList,
                ":dt": moment().utc().format()
            },
            ReturnValues:"UPDATED_NEW"
        };
        dynamo.update(params, function (err, data) {
            if (err) {
                console.log("Error", err);
                reject(err);
            } else {
                console.log("UPDATE_SUCCESS");
                resolve(data);
            }
        });
    });
}
function updateUserGroupIdList(userId,groupIdList){
    return new Promise((resolve, reject) => {
        var params = {
            TableName: process.env.USER_INFO_TABLE,
            Key:{
                "userId": userId,
            },
            UpdateExpression: "set groupIdList = :g, updatedDate = :dt",
            ExpressionAttributeValues:{
                ":g": groupIdList,
                ":dt": moment().utc().format()
            },
            ReturnValues:"UPDATED_NEW"
        };
        dynamo.update(params, function (err, data) {
            if (err) {
                console.log("Error", err);
                reject(err);
            } else {
                console.log("UPDATE_SUCCESS");
                resolve(data);
            }
        });
    });
}
exports.remove = async function (body) {
    const groupId = body.groupId;
    const userName = body.userName;
    let usrList = await getUserList(groupId);
    console.log(usrList);
    const userList = usrList.filter(user => user.Username !== userName);
    console.log('after delete ',userList);
    return new Promise(async (resolve, reject) => {
        let update_res = await updateUserList(groupId,userList);
        let groupIdList = await getGroupIdListFromUser(userName);
        console.log('old group id list ',groupIdList);
        const newGroupIdList = groupIdList.filter(_groupId => _groupId !== groupId);
        console.log('new group id list ',newGroupIdList);
        let res = await updateUserGroupIdList(userName,newGroupIdList);
        resolve(res);
    });
}