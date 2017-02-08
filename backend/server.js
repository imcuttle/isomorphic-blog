require("babel-core/register")

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const url = require('url')
// const session = require('express-session');
const path = require('path')
// var cookieParser = require('cookie-parser');
process.env.PORT = process.env.PORT || 6999;

process.on('uncaughtException', function (err) {
    console.error(err);
    console.error(err.stack);
});
const app = express();

// app.use(cookieParser());
// app.use(session({
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 1000*60*60*24 },
//     secret: 'face-njnu',
//     // store: 'MemStore'
// }));

app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.raw({limit:'5mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit:'5mb'}));
app.use(logger('dev'));

process.on('uncaughtException', console.error)

app.use((req, res, next) => {
    let ent;
    if(req.method==='POST') {
        ent = req.body
    } else {
        ent = req.query
    }
    req.ent = ent;
    next()
});


const fePath = module.exports.fePath = path.resolve(__dirname, '..', 'frontend', 'build')
const spacePath = path.resolve(__dirname, '..', 'source', 'public')

app.use('/public', express.static(spacePath))
app.all('/api', (req, res) => {
    res.end('By Moyu. <github.com/moyuyc> ');
})
app.use('/api', require('./routes/api').default)
app.use('/__ctl', require('./routes/ctl').default)
app.use('/', require('./routes/react-server').default);
app.use('/', express.static(fePath))

app.listen(process.env.PORT, () => console.log("Server Run On http://localhost:%s", process.env.PORT));