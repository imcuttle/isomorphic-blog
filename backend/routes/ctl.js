/**
 * Created by moyu on 2017/2/8.
 */
import express from 'express'
import {spawn} from 'child_process'
import path from 'path'
import {reset} from '../lib/space_processing'

const ctl = express();

const spawn_response = (res, cmd, args=[], cwd, notEnded, callback) => {
    if (notEnded) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
    }
    var ls = spawn(cmd, args, {cwd: cwd ? cwd : path.join(__dirname, '..', '..')})
    ls.stdout.on('data', (data) => {
        data = data.toString()
        console.log(data)
        res.write(data);
    });

    ls.stderr.on('data', (data) => {
        data = data.toString()
        console.log(data)
        res.write(data);
    });
    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`)
        if (!notEnded) {
            res.end(`child process exited with code ${code}`);
        } else {
            res.write(`child process exited with code ${code}`);
        }

        callback && callback(code)
    });
}

ctl.all('/pull', (req, res) => {
    spawn_response(res, "sudo", ['git', 'fetch', 'origin', 'master'], null, true,
        code => spawn_response(res, "sudo", ['git', 'reset', '--hard', 'origin/master'])
    )
})

ctl.all('/npmi', (req, res) => {
    spawn_response(res, "npm", ['install'])
})

ctl.all('/reset', (req, res) => {
    res.end('reset');
    reset();
})

ctl.all('/restart', (req, res) => {
    process.send && process.send('bye');
    res.end('restart');
})


export default ctl;