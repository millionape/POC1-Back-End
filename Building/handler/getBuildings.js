const gpf = require('../../GPF/gpf-connector');
exports.getBuildings = function (path_params) {
    return new Promise((resolve, reject) => {
        gpf.getBuildings({}).then(res => {
            resolve(res.body);
        }).catch(err => {
            reject(err);
        });
    });
};