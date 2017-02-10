/**
 * Created by moyu on 2017/2/8.
 */
import express from 'express'
import { normalize, checkEntThenResponse } from '../lib/utils'
import {spawn} from 'child_process'
import path from 'path'
import {reset} from '../lib/space_processing'

const ctl = express();

const spawn_response = (res, cmd, args=[], cwd) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
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
        res.end(`child process exited with code ${code}`);
    });
}

ctl.all('/pull', (req, res) => {
    spawn_response(res, "git", ['pull', 'origin', 'master'])
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