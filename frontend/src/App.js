/**
 * Created by Moyu on 16/10/20.
 */
import React from 'react';
import { bindActionCreators } from 'redux'
import {Link} from 'react-router'
import { connect } from 'react-redux'
import {Map} from 'immutable'

import utils, {loaded, isBrowser} from './common/utils'

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    // shouldComponentUpdate(nextProps, nextState, nextContext) {
    //     return this.props.location.pathname != nextProps.location.pathname
    //         || !Map(this.props.state).equals(Map(nextProps.state));
    // }
    componentWillUpdate(nextProps, nextState, nextContext) {
    }
    componentWillReceiveProps(newProps) {
        if (newProps.location.pathname !== this.props.location.pathname) {
            this.props.actions.pathUpdateEntry(newProps.location.pathname, newProps.params)
        }
    }
    componentDidMount() {
        const {actions, location: {pathname}, params, state: {base: fetchedConfig}} = this.props
        if (fetchedConfig) {
            loaded();
        } else {
            actions.fetchConfig().then(() => {
                loaded();
                actions.pathUpdateEntry(pathname, params);
            })
        }
    }
    componentWillMount() {
        // console.log('componentWillMount')  // will work in server render
        if (isBrowser) {
            const {actions, location: {pathname}, params, state: {base: fetchedConfig}} = this.props;
            actions.fetchConfig().then(() => {actions.pathUpdateEntry(pathname, params)})
        }
    }
    componentDidUpdate(prevProps, prevState) {}
    componentWillUnmount() {
        // console.log('componentWillUnmount')
    }

    static defaultProps = {

    }
    static propTypes = {

    }
    state = {

    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    render() {
        const {children, ...rest} = this.props
        const {state: { config: {title} }} = rest
        return (
            <div>
            {
                React.Children.map(children, (child, i) =>
                    React.cloneElement(child, Object.assign({
                        key: i,
                        title: title
                    }, {...rest}))
                )
            }
            </div>
        )
    }
}

function MapStateToProps(state) {
    return {
        state
    }
}

function MapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(require('./reducers/actions'), dispatch)
    }
}

module.exports = connect(
    MapStateToProps,
    MapDispatchToProps
)(App)

