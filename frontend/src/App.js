/**
 * Created by Moyu on 16/10/20.
 */
import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Loading from "./components/Loading";
import IdJson from "./components/IdJson";
import {loaded, isBrowser, getHiddenProp, getVisibilityState} from "./common/utils";


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
            loaded().then(() => this.setState({isFirst: false}));
        } else {
            actions.fetchConfig().then(() => {
                loaded().then(() => this.setState({isFirst: false}));
                actions.pathUpdateEntry(pathname, params);
            })
        }
    }

    componentWillMount() {
        // console.log('componentWillMount')  // will work in server render
        if (isBrowser) {
            const {actions, location: {pathname}, params, state: {base: fetchedConfig}} = this.props;
            actions.fetchConfig().then(() => {
                actions.pathUpdateEntry(pathname, params)
            });
            const icon = document.querySelector('link[rel="icon"]');

            const visProp = getHiddenProp();
            if (visProp) {
                const evtName = visProp.replace(/[H|h]idden/, '') + 'visibilitychange';
                document.addEventListener(evtName, function () {
                    icon.href = "/"+document[getVisibilityState()]+".ico";
                }, false);
            }

        }
    }

    componentDidUpdate(prevProps, prevState) {
    }

    componentWillUnmount() {
        // console.log('componentWillUnmount')
    }

    static defaultProps = {}
    static propTypes = {}
    state = {
        isFirst: true
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    render() {
        const {children, ...rest} = this.props;
        const {isFirst} = this.state;
        const {state: {config: {title, info, seo={}}, base: {fetching}}} = this.props;
        const {author={}} = seo
        const {name: author_name, image: author_image} = author;

        return (
            <div>
                <Loading show={!isFirst && fetching}/>
                <IdJson
                    json={{
                        '@type': 'WebSite',
                        'url': info.host+'/',
                        'publisher': title,
                        author: {
                            '@type': 'Person', name: author_name, url: info.host+'/',
                            image: {'@type': 'imageObject', url: author_image}
                        }
                    }}
                />
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