/**
 * Created by moyu on 2017/2/8.
 */
import React from "react";
import {Router, browserHistory, Route, Redirect, IndexRoute} from "react-router";
import App from "./App";

export const routerForSiteMap = (
    <Router history={ browserHistory }>
        <Route path="/">
            <IndexRoute/>
            <Route path="posts(/:page)"></Route>
            <Route path="article/:hrefTitle"></Route>
            <Route path="tags/:tagName" ></Route>
            <Route path="tags/pages/(:page)" ></Route>
            <Route path="archive(/:searchKey)"></Route>
            <Redirect path="*" to="/" />
        </Route>
    </Router>
)


if (typeof require.ensure !== 'function') {
    require.ensure = (d, c) => c(require);
}

export const routes = {
    path: '/',
    component: App,
    childRoutes: [
        require('./routers/PostsRouter').default,
        require('./routers/ArchiveRouter').default,
        require('./routers/ArticleRouter').default,
        require('./routers/TagRouter').default,
        require('./routers/TagsRouter').default,
        {
            path: '*',
            onEnter(nextState, replace) {
                replace('/');
            }
        }
    ],
    indexRoute: {
        getComponent: require('./routers/PostsRouter').default.getComponent
    }
}

export default <Router history={ browserHistory } routes={routes}/>
