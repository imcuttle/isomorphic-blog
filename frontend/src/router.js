/**
 * Created by moyu on 2017/2/8.
 */
import React from 'react'
import { Router, Route, IndexRoute, Redirect, IndexRedirect, browserHistory, hashHistory, useRouterHistory } from 'react-router'
import {routerReducer, syncHistoryWithStore, routerMiddleware} from 'react-router-redux'
import {createHashHistory, createBrowserHistory} from 'history'
import {createStore, applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import multi from 'redux-multi'

import appReducers, {initState} from './reducers/appReducers'

import App from './App'
import ArchivePage from './pages/ArchivePage'
import ArticlePage from './pages/ArticlePage'
import PostsPage from './pages/PostsPage'
import TagPage from './pages/TagPage'
import TagsPage from './pages/TagsPage'


export default (
    <Router history={ browserHistory }>
        <Route path="/" component={App}>
            <IndexRoute component={PostsPage}/>
            <Route path="posts(/:page)" component={PostsPage}></Route>
            <Route path="article/:hrefTitle" component={ArticlePage}></Route>
            <Route path="tags/:tagName" component={TagPage}></Route>
            <Route path="tags/pages/(:page)" component={TagsPage}></Route>
            <Route path="archive(/:searchKey)" component={ArchivePage}></Route>
            <Route path="*" onEnter={(loc, replace)=>{replace('/')}} />
        </Route>
    </Router>
)