/**
 * Created by moyu on 2017/2/10.
 */
require('babel-register');
const path = require('path')
const sitemapBuilder = require('react-router-sitemap-builder').default
const router = require('../frontend/src/router').default;
const fs = require('fs')

JSON.flatten = function(data) {
    var result = {};
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
            for(var i=0, l=cur.length; i<l; i++)
                recurse(cur[i], prop + '[' + i + ']');
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop+'.'+p : p);
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
    }
    recurse(data, '');

    return result;
}

var json = JSON.flatten(router);

const host = fs.readFileSync(__dirname+'/host').toString();

sitemapBuilder(router, host, path.resolve(__dirname, '../source/public/sitemap.txt'))
