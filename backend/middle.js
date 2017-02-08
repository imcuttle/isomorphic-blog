/**
 * Created by moyu on 2017/2/8.
 */

var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
var config = require('../webpack-isomorphic-conf')
config.debug = false
global.webpackIsomorphicTools = new WebpackIsomorphicTools(config)
    .server('../frontend')
    .then(() => {
        require('./server');
    })
    .catch(console.error);
