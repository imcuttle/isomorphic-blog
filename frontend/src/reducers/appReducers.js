import {routerReducer} from "react-router-redux";
import {combineReducers} from "redux";
import config from "./config";
import base from "./base";
import picture from "./picture";


export const initState = {
    config: require('./config').initState,
    base: require('./base').initState,
    picture: require('./picture').initState,
}
export default combineReducers({
    routing: routerReducer,
    config,
    base,
    picture
});