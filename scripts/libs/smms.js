/**
 * Created by moyu on 2017/2/10.
 */
var FormData = require('form-data');
var https = require('https');
const request = require('sync-request');

var md5 = function (text) {
    return require('crypto').createHash('md5').update(text).digest('hex');
}

var form = new FormData();

module.exports = {
    uploadSync(buffer) {
        if (buffer.length >= 1024 * 1024 * 5) {
            return -1;
        }
        var form = new FormData();
        // form.append('file_id', ''+Date.now());
        form.append('smfile', buffer, {
            filename: md5(buffer)
        });

        const res = request('POST', 'https://sm.ms/api/upload', {
            headers: form.getHeaders()
        });

        return JSON.parse(res.getBody('utf-8'));
    },

    upload(buffer) {
        if(buffer.length>=1024*1024*5) {
            return Promise.reject(false);
        }
        var form = new FormData();
        // form.append('file_id', ''+Date.now());
        form.append('smfile', buffer, {
            filename: md5(buffer)
        });

        return new Promise((resolve, reject) => {
            var request = https.request({
                method: 'post',
                hostname: 'sm.ms',
                path: '/api/upload',
                headers: form.getHeaders()
            }, (res) => {
                var all = '';
                res.on('data', chunk => all+=chunk)
                res.on('end', () => {
                    all = JSON.parse(all);
                    console.log(all);
                    resolve(all.code == 'success' && all.data && all.data.url)
                })
            }).on('error', () => resolve(false));

            form.pipe(request);
        })
    }
}
