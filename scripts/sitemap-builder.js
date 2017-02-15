/**
 * Created by moyu on 2017/2/10.
 */
require('babel-register');
const path = require('path')
const sitemapBuilder = require('react-router-sitemap-builder').default
const skipRegExp = require('../source/config').skipRegExp
const getSites = require('react-router-sitemap-builder').getSites
const html_encode = require('../frontend/src/common/utils').html_encode;
const router = require('../frontend/src/router').routerForSiteMap;
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

const sites = getSites(router) || [];

const articlePath = path.join(__dirname + '/../source/_articles')

const getUrlXMLString = (loc, lastmod, priority) => ["<url>", `<loc>${loc}</loc>`, `<lastmod>${lastmod}</lastmod>`, `<priority>${priority}</priority>`, "</url>"].join('')//reduce((p, n) => n ? (p+n+"\r\n") : p, "")


getUrlXMLString({})


const sitemapXML = (xmlString) => `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xmlString}</urlset>`


const rewrite = module.exports =  function () {
    const articleSites = fs.readdirSync(articlePath).filter(p => !skipRegExp.test(p))
        .map(p => ({mtime: fs.statSync(articlePath+'/'+p).mtime, loc: host+'/article/'+html_encode(p.replace(/\.[^\.]*$/, ''))}) ).sort((a, b) => b.mtime-a.mtime)



    let mapStr = [getUrlXMLString(host+'/', articleSites[0].mtime.toISOString(), "0.8")].concat(articleSites.map(x => getUrlXMLString(x.loc, x.mtime.toISOString(), "1.0")))
        .join('')

    mapStr = sitemapXML(mapStr);
    console.log(mapStr)

    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, '../source/public/sitemap.xml'), mapStr, function (err) {
            if (err) reject(err);
            else resolve(1);
        });
    })
}

rewrite();