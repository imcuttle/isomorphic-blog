/**
 * Created by moyu on 2017/2/8.
 */
import express from 'express'
import {SPACE_ARTICLES_PATH, SPACE_PATH, parseContent} from '../lib/space_processing'
import { normalize, checkEntThenResponse, writeFilePromise, readFilePromise, md5,
    gitpush, sendMail, mail_encode, sync, render, compile } from '../lib/utils'
import reWrite from '../../scripts/sitemap-builder'
import fs from 'fs';
import path from 'path';
import wrap from 'express-async-wrap';
const admin = express();
const checkRequestSecret = req => md5(req.ent.name+'-'+req.ent.pwd) === '1559328d1e102d24f6284970a7577423'
const compiled = compile(fs.readFileSync(path.join(__dirname, '../../template/mail.tpl.html')).toString());
const origin = fs.readFileSync(path.join(__dirname, '../../scripts/host')).toString();
const getMailHTML = (hrefTitle, data) => {
    return render(compiled, {...data, _link: origin, hrefTitle})
}
const sendMailProm = ({name, mail, title, html}) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(sendMail(
                'smtp.qq.com',
                '492899414@qq.com',
                'jrpzcdbebynzcabf',
                mail,
                `${mail_encode("From", "Moyu")} <moyuyc95@gmail.com>\r\n` +
                `${mail_encode("Subject", `[墨鱼新的文章出炉啦!] ${title}`)}\r\n` +
                `${mail_encode("To", name)} <${mail}>\r\n` +
                `Content-Type: text/html; charset="utf-8"\r\n\r\n` +
                `${html}`
            ))
        }, 1000);
    })

}


async function parse_SendMail (content, hrefTitle) {
    let mailers = await readFilePromise(SPACE_PATH+'/mailer.json');
    mailers = JSON.parse(mailers);
    console.log(mailers);
    // mailers = [{name: 'xx', mail: 'moyuyc95@gmail.com'}, {name: 'xxxx', mail: 'moyuyc95@gmail.com'}]
    hrefTitle = hrefTitle.replace(/\.[^\.]*$/, '')
    const json = parseContent(content);
    if (json.head.date) json.head.date = json.head.date.toLocaleString();
    let html = getMailHTML(hrefTitle, json);
    sync(mailers.map(r =>
        () => sendMailProm({...r, html, title: json.head.title})
    ))
}

const redirectUnLogin = (req, res, next) => {
    if (req.session.admin) {
        next();
    } else {
        res.redirect('/admin');
    }
}

const errorHandle = (err, req, res, next) => {
    console.error(err);
    res.normalize(500, err.stack);
}

admin.all('/add-receiver', wrap(async (req, res, next) => {
    try {
        let {name, mail} = req.ent;
        if (checkEntThenResponse(req.ent, res, ['name', 'mail'])) {
            name = name.trim();  mail = mail.trim();
            if (!/\w+?@\w+?\.\w+/.test(mail)) {
                res.normalize(500, ' 邮箱格式不正确');
            } else {
                const data = await readFilePromise(SPACE_PATH+'/mailer.json');
                const mailer = JSON.parse(data);
                if (mailer.find(x => x.mail == mail)) {
                    res.normalize(500, '该邮箱已经添加了！');
                } else {
                    mailer.push({name, mail, time: new Date().toLocaleString()});
                    if (await writeFilePromise(SPACE_PATH+'/mailer.json', JSON.stringify(mailer, null, 2))) {
                        res.normalize(200, '订阅成功');
                        await gitpush();
                    } else {
                        res.normalize(500, '订阅失败');
                    }
                }
            }
        }
    } catch (ex) {
        next(ex);
    }
}))

// admin.all('/post-pure', wrap(async function (req, res, next) {
//     try {
//         let {content, title, pwd, name} = req.ent;
//         if (checkEntThenResponse(req.ent, res, ['content', 'title', 'pwd', 'name'])) {
//             if (!title.includes(".")) {
//                 title += '.md';
//             }
//             if (checkRequestSecret(req)) {
//                 if (await writeFilePromise(SPACE_ARTICLES_PATH+'/'+title, content)) {
//                     res.json(normalize(200, "Well Done."))
//                     await parse_SendMail(content, title);
//                 }
//             } else {
//                 res.json(normalize(500, 'Error Secret'))
//             }
//         }
//     } catch (ex) {
//         next(ex);
//     }
// }))

admin.all('/login', wrap(async (req, res, next) => {
    let {pwd, name} = req.ent;
    if (checkEntThenResponse(req.ent, res, ['name', 'pwd'])) {
        if (checkRequestSecret(req)) {
            req.session.admin = name;
            res.normalize(200, 'Fine.');
        } else {
            res.normalize(500, 'Error Secret')
        }
    }
}))

admin.use(redirectUnLogin)

admin.all('/out', wrap(async (req, res, next) => {
    delete req.session.admin;
    res.normalize(200, 'Fine.');
}))

admin.all('/post/update', wrap(async (req, res, next) => {
    try {
        let {id} = req.ent;
        if (checkEntThenResponse(req.ent, res, ['id'])) {
            const str = await readFilePromise(SPACE_ARTICLES_PATH+'/'+id);
            res.normalize(200, str);
        }
    } catch (ex) {
        next(ex);
    }
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
                if (!force) {
                    await reWrite();
                    const i = content.search(/<!--\s*more\s*-->/);
                    if (i>=0) {
                        content = content.slice(0, i) + ' ...（点击标题查看更多）';
                    }
                    await parse_SendMail(content, title);
                }
                await gitpush();
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
            await reWrite();
            res.json(normalize(200, "Deleted"));
            await gitpush();
        }
    } catch (ex) {
        next(ex);
    }
}))

admin.use(errorHandle)

export default admin;