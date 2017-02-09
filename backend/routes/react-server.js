/**
 * Created by moyu on 2017/2/8.
 */
import express from 'express'
import path from 'path'
import fs from 'fs'
import url from 'url'
import React from 'react';
import {renderToString} from 'react-dom/server'
// import createMemoryHistory from 'history/createMemoryHistory'
import reactRouter, {match, RouterContext} from 'react-router'
import {Provider} from 'react-redux'
import DocumentTitle from 'react-document-title'
import DocumentMeta from 'react-document-meta'

import {pathUpdateEntry, fetchConfig} from '../../frontend/src/reducers/actions'
import {initState} from '../../frontend/src/reducers/appReducers'
import MyRouter from '../../frontend/src/router'
import {configureStore} from '../../frontend/src/main'


const server = express();
import {fePath, spacePath} from '../server'

server.use(handleRender);
// This is fired every time the server side receives a request
function handleRender(req, res, next) {
    // console.log(req.url, req.originalUrl);
    match({ routes: MyRouter, location: req.url }, function(error, redirectLocation, renderProps) {
        if (error) {
            res.status(500).send(error.stack);
        } else if (redirectLocation) {
            if( fs.existsSync(path.join(fePath, url.parse(req.url).pathname))
                || fs.existsSync(path.join(spacePath, url.parse(req.url).pathname)) ) {
                next();
            } else {
                res.redirect(302, redirectLocation.pathname + redirectLocation.search);
            }
        } else if (renderProps) {
            var store = configureStore(initState);
            // we can invoke some async operation(eg. fetchAction or getDataFromDatabase)
            // call store.dispatch(Action(data)) to update state.
            // console.log('renderProps', renderProps)
            store.dispatch(fetchConfig()).then(f => store.dispatch(pathUpdateEntry(renderProps.location.pathname, renderProps.params)))
            .then(() => res.renderStore(store, renderProps))
        } else {
            res.status(404).send('Not found')
        }
    })
}

express.response.renderStore = function (store, renderProps) {
    const html = renderToString(
        <Provider store={store}>
            <RouterContext {...renderProps} />
        </Provider>
    );
    const title = DocumentTitle.rewind();
    const meta = DocumentMeta.renderAsHTML();

    this.header('content-type', 'text/html; charset=utf-8')
    this.send(renderFullPage(title, html, store.getState(), meta))
}


const htmlPath = path.join(fePath, 'index.html');
var html = fs.readFileSync(htmlPath).toString();
fs.watch(htmlPath, () => {
    console.log('html changed')
    html = fs.readFileSync(htmlPath).toString();
})


function renderFullPage(title, partHtml, initialState, headerInsertHTML) {
    // <!--HTML-->
    var allHtml = html;
    if (initialState) {
        allHtml = allHtml.replace(/\/\*\s*?INITIAL_STATE\s*?\*\//, `window.__INITIAL_STATE__=${JSON.stringify(initialState)}`)
    }
    if (title) {
        allHtml = allHtml.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
    }
    if (headerInsertHTML) {
        allHtml = allHtml.replace(/<!--\s*?HEAD_INSERT\s*?-->/, headerInsertHTML);
    }
    return allHtml.replace(/<!--\s*?HTML\s*?-->/, partHtml);

}



export default server;




