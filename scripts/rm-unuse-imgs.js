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

const usedImages = []

const uploadForSrc = (src, filename) => {
    if (isUrlString(src)) {
        return false;
    } else {
        const file = publicPath + (src.startsWith('/') ? src : '/'+src);
        if (fs.existsSync(file)) {
            console.log(src, filename);
            // console.log(file, src)
            // const json = smms.uploadSync(fs.readFileSync(file));
            usedImages.push(file);
        }
        return false;
    }
}

const setMarkDownImageUpload = (markdown, file) => {
    return markdown.replace(/<img([^=]*?)>([\s\S]*?<\/\s*?img>)*/g, (m, c) => {
        if ( /src=["']?([\s\S]+?)["']?/.test(c) ) {
            const src = RegExp.$1;
            if (!uploadForSrc(src, file)) {
                return m;
            }
            return m;
        } else {
            return m;
        }
    }).replace(/!\[([\s\S]*?)\]\(([\s\S]*?)\)/g, (m, alt, src) => {
        if (src) {
            if (!uploadForSrc(src, file)) {
                // console.log(m);
                return m;
            }
            return m;
        }
        return m;
    })
}

const isUrlString = str => url.parse(str).slashes

const files = process.argv.filter(name=>!skipRegExp.test(name));

files.forEach((file, i, all) => {
    console.log('[ING]', file, `${i+1}/${all.length}`);
    const str = fs.readFileSync(file).toString();
    const after = setMarkDownImageUpload(str, file);
    fs.writeFileSync(file, after);
})

console.log('usedImages', usedImages, usedImages.length);

const getAbsoluteFiles = dir => fs.readdirSync(dir).map(f => path.resolve(dir, f))

const allImages = getAbsoluteFiles(publicPath+'/images').concat(getAbsoluteFiles(publicPath+'/upload'));

console.log('Total', allImages.length);

allImages.filter(file => !usedImages.includes(file))
    .forEach(f => {
        console.log('[RM] ', f);
        try {
            fs.unlinkSync(f);
        } catch (ex) {
            console.error(ex.message);
        }
    })