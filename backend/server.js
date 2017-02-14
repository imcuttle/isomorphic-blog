require("babel-core/register")
require('babel-polyfill');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const url = require('url')
const session = require('express-session');
const path = require('path')
const minify = require('express-minify');

process.env.PORT = process.env.PORT || 6999;

process.on('uncaughtException', function (err) {
    console.error(err);
    console.error(err.stack);
});
const app = express();

// app.use(cookieParser());

// view engine setup
app.use(require('less-middleware')(__dirname+'/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.raw({limit:'5mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit:'5mb'}));
app.use(logger('dev'));
app.use(minify({
    js_match: /js/,
    css_match: /css/,
    cache: true
}));

app.use(session({
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000*60*60*24 },
    secret: 'mimimimi',
    // store: 'MemStore'
}));

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
const spacePath = module.exports.spacePath = path.resolve(__dirname, '..', 'source', 'public')

app.all('/api', (req, res) => {
    res.end('By Moyu. <github.com/moyuyc> ');
})
app.use('/api', require('./routes/api').default)
app.use('/api/admin', require('./routes/admin').default)
app.use('/__ctl', require('./routes/ctl').default)

app.all('/public/config.json', (req, res) => {
    require('fs').readFile(spacePath+'/config.yml', (err, data) => {
        if (err) {
            res.status(500).end(err.message);
        } else {
            res.json(require('js-yaml').safeLoad(data.toString()))
        }
    })
})

app.use('/admin', require('./routes/admin-render').default)
app.use('/subscribe', (req, res) => {
    res.render('subscribe', {title: '订阅'})
})
app.use('/', require('./routes/react-server').default);
app.use('/', express.static(spacePath))
app.use('/', express.static(fePath))



app.listen(process.env.PORT, () => console.log("Server Run On http://localhost:%s", process.env.PORT));