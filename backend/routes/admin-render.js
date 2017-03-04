/**
 * Created by moyu on 2017/2/8.
 */
import express from 'express'
import {SPACE_ARTICLES_PATH, SPACE_PATH} from '../lib/space_processing'
import fs from 'fs';
import wrap from 'express-async-wrap';

const admin = express();

const redirectUnLogin = (req, res, next) => {
    if (req.session.admin) {
        next();
    } else {
        res.redirect('/admin');
    }
}

const errorHandle = (err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.stack);
}

admin.all('/', (req, res) => {
    if (req.session.admin) {
        res.redirect("/admin/dashboard");
    } else {
        res.render('admin', {title: '管理员', subtitle: 'For Better.'});
    }
})

admin.use(redirectUnLogin)

const readdir = (dir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) reject(err);
            else resolve(files);
        })
    })
}

admin.all('/dashboard', wrap( async (req, res) => {
    let files = await readdir(SPACE_ARTICLES_PATH);
    files = files.map((v) => ({name: v, time: fs.statSync(SPACE_ARTICLES_PATH + '/' + v).mtime.getTime()}))
        .sort((a, b) => b.time - a.time)
        .map(v => v.name)



    res.render('admin-dashboard', {
        title: '管理员面板', subtitle: '你好，'+req.session.admin,
        articles: files
    });
}))

admin.use(errorHandle)

export default admin;