#!/usr/bin/env node
const sizeOf = require('image-size');
const request = require('sync-request');
var url = require('url');
var path = require('path');
var fs = require('fs');

const articlesPath = path.join(__dirname, '..', 'source', '_articles')
const publicPath = path.join(__dirname, '..', 'source', 'public')
const skipRegExp = require('../source/config').skipRegExp

// const files = fs.readdirSync(articlesPath).filter(name=>!skipRegExp.test(name));

const setMarkDownImageSize = (markdown, p) => {
    let matched = false;
    markdown = markdown.replace(/<img([\s\S]*?)>([\s\S]*?<\/\s*?img>)*/g, (m, c) => {
        if (c.includes(' width=') && c.includes(' height=')) {
            console.log(`[SKIP] ${p} (had size) => ` + m);
            return m;
        }
        if ( /src=["']([\s\S]+?)["']/.test(c) ) {
            const src = RegExp.$1;
            let size;
            if (isUrlString(src)) {
                size = getImageSizeFromUrl_PathSync(src);
            } else {
                size = getImgSizeFromPathSync(publicPath + (src.startsWith('/') ? src : '/'+src) );
            }
            if (!size) {
                console.error(`[ERROR] from ${p}  ${m}`)
            }
            return size ? m.replace(/width=[\s\S]*?(\s?)/, 'width='+size.width+'$1')
                    .replace(/height=[\s\S]*?(\s?)/, 'height='+size.height+'$1') : m;
        } else {
            console.log(`[SKIP] ${p} (no src) => ` + m);
            return m;
        }
    });

    return markdown.replace(/!\[([\s\S]*?)\]\(([\s\S]*?)\)/g, (m, alt, src) => {
        if (src) {
            let size;
            if (isUrlString(src)) {
                size = getImageSizeFromUrl_PathSync(src);
            } else {
                size = getImgSizeFromPathSync(publicPath + (src.startsWith('/') ? src : '/'+src) );
            }
            if (!size) {
                console.error(`[ERROR] from ${p}  ${m}`)
            }
            return size ? `<img src="${src}" alt="${alt}" width="${size.width}" height="${size.height}" />` : m;
        }
        return m;
    })
}

const isUrlString = str => url.parse(str).slashes

const getImageSizeFromUrl_Path = (src) => {
    const ops = url.parse(src);
    return ops.slashes ? getImgSizeFromURL(src) : getImgSizeFromPath(src)
}

const getImageSizeFromUrl_PathSync = (src) => {
    const ops = url.parse(src);
    return ops.slashes ? getImgSizeFromURLSync(src) : getImgSizeFromPathSync(src);
}

const getImgSizeFromURL = (url) => {
    const ops = url.parse(imgUrl);
    const protocol = ops.protocol.replace(/:$/, '');
    let protocolPackage;
    if (protocol === 'http' || protocol === 'https') {
        protocolPackage = require(protocol);
    } else {
        return Promise.reject("illegal protocol: " + protocol)
    }

    return new Promise( function (resolve, reject) {
        protocolPackage.get(url, function (res) {
            let statusCode = res.statusCode;
            if (statusCode === 302 || statusCode === 301) {
                console.log(url, statusCode, "=>", res.headers['location']);
                return getImgSizeFromURL(res.headers['location'])
            }
            const chunks = []
            res.on('data', function (chunk) {
                chunks.push(chunk);
            }).on('end', () => {
                const buffer = Buffer.concat(chunks);
                const size = sizeOf(buffer);
                console.log(url, "<=>", size);
                resolve(size);
            })
        }).on('error', (err) => reject(err.message))
    })
}

const getImgSizeFromURLSync = (url) => {
    try {
        const res = request('GET', url);
        const size = sizeOf(res.getBody());
        console.log("[URL]", url, '<=>', size);
        return size;
    } catch (ex) {
        console.error(ex.message);
        return null;
    }
}

const getImgSizeFromPath = (path) => {
    return new Promise((resolve, reject) => {
        sizeOf(path, (err, size) => {
            if (err) reject(err.message);
            else {
                console.log(path, "<=>", reject)
                resolve(size);
            }
        })
    })
}

const getImgSizeFromPathSync = (path) => {
    try {
        const size = sizeOf(path);
        console.log("[PATH]", path, '<=>', size);
        return size;
    } catch (ex) {
        console.error(ex.message);
        return null;
    }
}


const files = process.argv.filter(name=>!skipRegExp.test(name));

files.forEach((file, i, all) => {
    console.log('[ING]', file, `${i+1}/${all.length}`);
    const str = fs.readFileSync(file).toString();
    const after = setMarkDownImageSize(str, path.resolve(file));
    fs.writeFileSync(file, after);
})
