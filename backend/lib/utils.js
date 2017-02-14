/**
 * Created by moyu on 2017/2/8.
 */
import {readFile, writeFile} from 'fs';
import path from 'path';

export const normalize = (code, result) => ({code, result})

export const checkEntThenResponse = (ent, res, necessary=[]) => {
    if(!necessary.every(key => typeof ent[key] !== 'undefined')) {
        res.json(normalize(400, "参数不正确，必须: "+necessary));
        return false;
    }
    return true;
}

export const testWord = (searchWord, text="") => {
    searchWord = searchWord.trim();
    if(!searchWord) return false;
    return text.search(new RegExp(searchWord, 'i')) >= 0;
}

export const writeFilePromise = (filename, data) => {
    return new Promise((resolve, reject) => {
        writeFile(filename, data, (err) => {
            if (err) {reject(err)}
            else {
                resolve(true);
            }
        })
    })
}
export const readFilePromise = (filename) => {
    return new Promise((resolve, reject) => {
        readFile(filename, (err, data) => {
            if (err) reject(err);
            else resolve(data.toString());
        })
    })
}

export const md5 = (text) => {
    var crypto = require('crypto');
    return crypto.createHash('md5').update(text).digest('hex');
}

export const mail_encode  = (key, val, encode="utf-8") => {
    return `${key}: =?${encode}?B?${new Buffer(val).toString('base64')}?=`
}

export const sync = (callables) => {
    if(callables.length==0) {
        return Promise.resolve();
    }
    return callables.shift().call()
        .then(function(x) {
            return sync(callables);
        })
}

export const exec = (cmd, args=[], cwd=path.join(__dirname, '../..')) => {
    return new Promise((resolve, reject) => {
        const cp = require('child_process').spawn(cmd, args, {cwd})
        cp.on('error', (err) => reject(err));
        cp.stdout.on('data', data => console.log(data.toString()));
        cp.stderr.on('data', data => console.error(data.toString()));
        cp.on('close', (code) => code == 0 ? resolve(true) : reject(new Error(cmd+' '+args.toString()+' ends with '+code)))
    })
}

export const execIgnore = (cmd, args=[], cwd=path.join(__dirname, '../..')) => {
    return new Promise((resolve, reject) => {
        const cp = require('child_process').spawn(cmd, args, {cwd})
        cp.on('error', (err) => console.error(err));
        cp.stdout.on('data', data => console.log(data.toString()));
        cp.stderr.on('data', data => console.error(data.toString()));
        cp.on('close', (code) => resolve(true))
    })

}


export async function gitpush () {
    await execIgnore('git', ['add', '.'])
    await execIgnore('git', ['commit', '-am', 'sync from server'])
    await exec('git', ['push', 'origin', 'master'])
}

export const sendMail = (host,user,pwd,to,msg) => {
    const net = require('net');
    return new Promise(resolve => {
        var socket = net.createConnection(25,host);
        var user64 = new Buffer(user).toString("base64");
        pwd  = new Buffer(pwd ).toString("base64");
        socket.on('connect',function () {
            this.write('HELO '+user+'\r\n');
        });
        var wt = net.Socket.prototype.write;
        socket.write = function () {
            return wt.apply(this,arguments);
        }

        var op = ['AUTH LOGIN\r\n'];
        socket.on('close', (had_error) => {
            !had_error && resolve();
        })
        socket.on('error', (err) => {
            resolve(err);
        })

        socket.pipe(process.stdout);
        socket.on('data',function (data) {
            data = data.toString();
            data.split('\r\n').forEach(data=>{
                var m = data.match(/^\d{3}/)
                if(!m) return;
                var code = m[0]
                switch (code){
                    case '250':{
                        var v = op.shift();
                        if(v==='AUTH LOGIN\r\n'){
                            op.push(user64+'\r\n');
                            op.push(pwd+'\r\n');
                        }else if(v==='RCPT TO:'+to+'\r\n'){
                            op.push('DATA\r\n');
                            op.push(msg+'\r\n.\r\n');
                        }
                        socket.write(v);
                        break;
                    }
                    case '334':{
                        var v = op.shift();
                        socket.write(v);
                        if(op.length===0) op.push('MAIL FROM:'+user+'\r\n');
                        break;
                    }
                    case '235': socket.write(op.shift()); op.push('RCPT TO:'+to+'\r\n'); break;
                    case '221': socket.end(); break;
                    case '354': socket.write(op.shift()); op.push('QUIT'+'\r\n'); break;
                    // default : console.log(data);
                }
            });
        })
    })
}