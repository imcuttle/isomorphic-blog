#!/usr/bin/env node

var url = require('url');
var path = require('path');
var fs = require('fs');

const qn = require('./libs/qiniu')
const smms = require('./libs/smms')

const articlesPath = path.join(__dirname, '..', 'source', '_articles')
const publicPath = path.join(__dirname, '..', 'source', 'public')
const skipRegExp = require('../source/config').skipRegExp

// const files = fs.readdirSync(articlesPath).filter(name=>!skipRegExp.test(name));

const uploadForSrc = src => {
    if (isUrlString(src)) {
        return false;
    } else {
        const file = publicPath + (src.startsWith('/') ? src : '/'+src);
        if (fs.existsSync(file)) {
            console.log(file, src)
            const json = smms.uploadSync(fs.readFileSync(file));
            if (! json <= 0 ) {
                console.log(json);
                return;
            }
        }
        return false;
    }
}

const setMarkDownImageUpload = (markdown) => {
    return markdown.replace(/<img([\s\S]*?)>([\s\S]*?<\/\s*?img>)*/g, (m, c) => {
        if ( /src=["']?([\s\S]+?)["']?/.test(c) ) {
            const src = RegExp.$1;
            if (!uploadForSrc(src)) {
                console.log(m);
                return m;
            }

        } else {
            return m;
        }
    }).replace(/!\[([\s\S]*?)\]\(([\s\S]*?)\)/g, (m, alt, src) => {
        if (src) {
            if (!uploadForSrc(src)) {
                console.log(m);
                return m;
            }
        }
        return m;
    })
}

const isUrlString = str => url.parse(str).slashes

const files = process.argv.filter(name=>!skipRegExp.test(name));

files.forEach((file, i, all) => {
    console.log('[ING]', file, `${i+1}/${all.length}`);
    const str = fs.readFileSync(file).toString();
    const after = setMarkDownImageUpload(str);
    fs.writeFileSync(file, after);
})
