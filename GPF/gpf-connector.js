var aws4 = require('aws4');
var request = require("request");

const gpf_requester = {
  POST: function (path, body) {
    return new Promise((resolve, reject) => {
      var opts = {
        uri: `https://deploy.124469633786.dev-gpf.com/${path}`,
        host: `deploy.124469633786.dev-gpf.com`,
        service: 'execute-api',
        path: `/${path}`,
        method: 'POST',
        region: 'ap-southeast-1',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'X-GPF-Person-id': 'test',
          'Content-Type': 'application/x-amz-json-1.0'
        },
        body: JSON.stringify(body)
      };
      console.log(opts);
      request(aws4.sign(opts, {
        secretAccessKey: 'csmpHkfdC2qdJKy2SGAUSTTtdd7GpB+W2np+NbH4',
        accessKeyId: 'AKIARZ6XX4L5PAH66IQ5'
      }), function (error, response, body) {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve({
          response: response,
          body: body
        });

      });

    });
  },
  GET: function (path, body) {
    return new Promise((resolve, reject) => {
      var opts = {
        uri: `https://deploy.124469633786.dev-gpf.com/${path}`,
        host: `deploy.124469633786.dev-gpf.com`,
        service: 'execute-api',
        path: `/${path}`,
        method: 'GET',
        region: 'ap-southeast-1',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'X-GPF-Person-id': 'test',
          'Content-Type': 'application/x-amz-json-1.0'
        },
        body: JSON.stringify(body)
      };
      console.log(opts);
      request(aws4.sign(opts, {
        secretAccessKey: 'csmpHkfdC2qdJKy2SGAUSTTtdd7GpB+W2np+NbH4',
        accessKeyId: 'AKIARZ6XX4L5PAH66IQ5'
      }), function (error, response, body) {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve({
          response: response,
          body: JSON.parse(body)
        });

      });

    });
  }
}


exports.getBuildings = function (body) {
  return new Promise((resolve, reject) => {
    gpf_requester.GET(`building/v1/buildings`, body).then(res => {
      console.log('resres', res)
      resolve(res);
    }).catch(err => {
      reject(err);
    });
  });
}