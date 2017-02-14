/**
 * Created by moyu on 2017/2/8.
 */
import express from 'express'
import {SPACE_ARTICLES_PATH, SPACE_PATH} from '../lib/space_processing'
import { normalize, checkEntThenResponse, writeFilePromise, readFilePromise, md5, gitpush } from '../lib/utils'
import fs from 'fs';
import wrap from 'express-async-wrap';

const admin = express();

const checkRequestSecret = req => md5(req.ent.name+'-'+req.ent.pwd) === '24ecfe337456b66831c3bf21cbd2f72a'

const redirectUnLogin = (req, res, next) => {
    if (req.session.admin) {
        next();
    } else {
        res.redirect('/admin');
    }
}

const errorHandle = (err, req, res, next) => {
    console.error(err);
    res.json(normalize(500, err.stack));
}

admin.all('/add-receiver', wrap(async (req, res, next) => {
    try {
        let {name, mail} = req.ent;
        if (checkEntThenResponse(req.ent, res, ['name', 'mail'])) {
            name = name.trim();  mail = mail.trim();
            if (!/\w+?@\w+?\.\w+/.test(mail)) {
                res.json(normalize(500, ' 邮箱格式不正确'));
            } else {
                const data = await readFilePromise(SPACE_PATH+'/mailer.json');
                const mailer = JSON.parse(data);
                if (mailer.find(x => x.mail == mail)) {
                    res.json(normalize(500, '该邮箱已经添加了！'));
                } else {
                    mailer.push({name, mail});
                    if (await writeFilePromise(SPACE_PATH+'/mailer.json', JSON.stringify(mailer, null, 2))) {
                        res.json(normalize(200, '订阅成功'));
                        gitpush();
                    } else {
                        res.json(normalize(500, '订阅失败'));
                    }
                }
            }
        }
    } catch (ex) {
        next(ex);
    }
}))

admin.all('/post-pure', wrap(async function (req, res, next) {
    try {
        let {content, title, pwd, name} = req.ent;
        if (checkEntThenResponse(req.ent, res, ['content', 'title', 'pwd', 'name'])) {
            if (!title.includes(".")) {
                title += '.md';
            }
            if (checkRequestSecret(req)) {
                if (await writeFilePromise(SPACE_ARTICLES_PATH+'/'+title, content)) {
                    res.json(normalize(200, "Well Done."))
                }
            } else {
                res.json(normalize(500, 'Error Secret: '+req.ent.secret))
            }
        }
    } catch (ex) {
        next(ex);
    }
}))

admin.all('/login', wrap(async (req, res, next) => {
    let {pwd, name} = req.ent;
    if (checkEntThenResponse(req.ent, res, ['name', 'pwd'])) {
        if (checkRequestSecret(req)) {
            req.session.admin = name;
            res.json(normalize(200, 'Fine.'))
        } else {
            res.json(normalize(500, 'Error Secret: '+secret))
        }
    }
}))

admin.use(redirectUnLogin)

admin.all('/out', wrap(async (req, res, next) => {
    delete req.session.admin;
    res.json(normalize(200, 'Fine.'))
}))

admin.all('/post', wrap(async function (req, res, next) {
    try {
        let {content, title, force} = req.ent;
        if (checkEntThenResponse(req.ent, res, ['content', 'title'])) {
            if (!title.includes(".")) {
                title += '.md';
            }
            if (!force && fs.existsSync(SPACE_ARTICLES_PATH+'/'+title)) {
                res.json(normalize(4000, "Existed!"))
            } else if (await writeFilePromise(SPACE_ARTICLES_PATH+'/'+title, content)) {
                res.json(normalize(200, "Well Done."));
                gitpush();
            }
        }
    } catch (ex) {
        next(ex);
    }
}))

const unlink = (file) => {
    return new Promise((resolve, reject) => {
        fs.unlink(file, (err) => {
            if (err) reject(err);
            else resolve()
        })
    })
}

admin.all('/post/del', wrap(async function (req, res, next) {
    try {
        let {id} = req.ent;
        if (checkEntThenResponse(req.ent, res, ['id'])) {
            await unlink( SPACE_ARTICLES_PATH + '/' + id);
            res.json(normalize(200, "Deleted"));
            gitpush();
        }
    } catch (ex) {
        next(ex);
    }
}))

admin.use(errorHandle)

export default admin;