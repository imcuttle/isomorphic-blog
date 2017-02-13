/**
 * Created by Moyu on 16/10/20.
 */
import {render} from "react-dom";
import React from "react";
import {browserHistory} from "react-router";
import {routerMiddleware} from "react-router-redux";
import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import thunkMiddleware from "redux-thunk";
import multi from "redux-multi";
import appReducers, {initState} from "./reducers/appReducers";
import "./common/css/main.text.less";
import "./common/css/loading.text.less";
import "./common/css/pace.text.less";
import MyRouters from "./router";
import {isBrowser} from "./common/utils";

var _initState = isBrowser && window.__INITIAL_STATE__ || initState
export const configureStore = (initialState, middleware) => {
    let store = createStore(
        appReducers, initialState,
        applyMiddleware(
            routerMiddleware(browserHistory),
            multi,
            thunkMiddleware, // 允许我们 dispatch() 函数
            // routerMiddleware
            // loggerMiddleware // 一个很便捷的 middleware，用来打印 action 日志
        )
    )

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducers/appReducers', () => {
            const nextRootReducer = require('./reducers/appReducers');
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}


const store = configureStore(_initState)


if (isBrowser) {

    render((
        <Provider store={store}>
            {MyRouters}
        </Provider>
    ), document.getElementById('app'))
}


