/**
 * Created by moyu on 2017/2/10.
 */
var qn = require("qn");
var fs = require('fs');

var client = null;

module.exports = {
    setClient: function (accessKey, secretKey, bucket, origin) {
        accessKey = accessKey && accessKey.trim();
        secretKey = secretKey && secretKey.trim();
        bucket = bucket && bucket.trim();
        origin = origin && origin.trim();
        if(!accessKey || !secretKey || !bucket || !origin) {
            return false;
        }
        client = qn.create({
            accessKey: accessKey,
            secretKey: secretKey,
            bucket: bucket,
            origin: origin,
            // timeout: 3600000, // default rpc timeout: one hour, optional
            // if your app outside of China, please set `uploadURL` to `http://up.qiniug.com/`
            // uploadURL: 'http://up.qiniu.com/',
        });
        return true;
    },
    clientIsNull () {
        return !client;
    },
    upload: function (imgBuffer) {
        if(!client) return Promise.reject(new Error('client is null'));
        return new Promise (function (resolve, reject) {
            client.upload(imgBuffer, function (err, result) {
                if(err) {
                    reject(err);
                } else {
                    console.log(result);
                    if(result.url) {
                        result.url += '?imageslim';
                    }
                    resolve(result);
                }
            })
        })
    }
}
