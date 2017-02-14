require("babel-core/register")
require('babel-polyfill');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const url = require('url')
const session = require('express-session');
const path = require('path')
const compression = require('compression');
const fs = require('fs')
var UglifyJS = require("uglify-js");



process.env.PORT = process.env.PORT || 6999;

process.on('uncaughtException', function (err) {
    console.error(err);
    console.error(err.stack);
});
const app = express();

// app.use(cookieParser());
app.use(compression());

// view engine setup
app.use(require('less-middleware')(__dirname+'/public'));
app.use('/js', (req, res, next) => {
    const pathname = decodeURIComponent(url.parse(req.originalUrl).pathname)
    const abFile = __dirname + '/public'+pathname;
    if (fs.existsSync(abFile)) {
        if (abFile.endsWith('.js')) {
            res.set('content-type', 'application/javascript');
            fs.readFile(abFile, (err, data) => {
                if (!err) {
                    data = data.toString();
                    if (process.env.NODE_ENV == 'production') {
                        data = UglifyJS.minify(data, {fromString: true}).code
                    }
                    res.send(data);
                }
            })
        } else {
            res.sendFile(abFile)
        }
    } else {
        next();
    }
});

app.use(express.static(__dirname+'/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.raw({limit:'5mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit:'5mb'}));
app.use(logger('dev'));
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


const fePath = module.exports.fePath = path.join(__dirname, '..', 'frontend', 'build')
const spacePath = module.exports.spacePath = path.join(__dirname, '..', 'source', 'public')

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
            res.json(require('js-yaml').safeLoad(data.toString(), {schema: require('js-yaml').FAILSAFE_SCHEMA} ))
        }
    })
})

app.use('/admin', require('./routes/admin-render').default)
app.use('/subscribe-person', (req, res) => {
    res.sendFile(path.join(spacePath, '../mailer.json'));
})
app.use('/subscribe', (req, res) => {
    res.render('subscribe', {title: '订阅'})
})
app.use('/', require('./routes/react-server').default);
app.use('/', express.static(spacePath))
app.use('/', express.static(fePath))



app.listen(process.env.PORT, () => console.log("Server Run On http://localhost:%s", process.env.PORT));