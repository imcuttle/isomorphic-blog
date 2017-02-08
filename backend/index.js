/**
 * Created by moyu on 2017/2/8.
 */
var cp = require('child_process')
var p = require('path')
var fs = require('fs')

const isDir = (filepath) => fs.statSync(filepath).isDirectory()
const fePath = p.resolve(__dirname, '..', 'frontend')

fs.watch(__dirname, {recursive: true}, watchHandle);
fs.watch(p.join(__dirname, '..', 'source', 'config.js'), watchHandle);

process.env.NODE_ENV === 'production' && fs.watch(p.join(fePath, 'src'), {recursive: true}, watchHandle);

function watchHandle (type, filename) {
    if(p.basename(filename).startsWith('.') || !filename.endsWith(".js")) {
        return;
    }

    console.log(type, filename);
    serverProcess.kill('SIGINT');
    serverProcess = runServer();
}

var serverProcess = runServer();

function runServer() {
    return cp.fork(process.env.NODE_ENV === 'development' ? './server.js' : './middle.js', process.argv, {stdio: [0, 1, 2, 'ipc']})
        .on('message', (message) => {
            console.log('Get Message from child: %s', message);
            if (message === 'bye') {
                serverProcess.kill('SIGINT');
                serverProcess = runServer();
            }
        })
}
