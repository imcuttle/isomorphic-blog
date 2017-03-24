import React from 'react'
import {Map} from 'immutable'
import {isBrowser} from '../../common/utils'
var parser = require('ua-parser-js');


const tmp = {}

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.resetComment = this.resetComment.bind(this)
        this.renderShareHTML = this.renderShareHTML.bind(this)
        this.renderShare = this.renderShare.bind(this)
    }

    componentWillMount() {

    }


    resetComment (props=this.props) {
        const {url, identity, short} = props;
        DISQUS && DISQUS.reset({
            reload: true,
            config: function () {
                this.page.identifier = identity;
                this.page.url = url || window.location.href;
            }
        });
    }

    componentDidMount() {
        const {short, identity, title, url} = this.props;
        if (isBrowser && !tmp.loaded) {
            window.disqus_config = function () {
                this.page.title = title;
                this.page.url = url || window.location.href;  // Replace PAGE_URL with your page's canonical URL variable
                this.page.identifier = identity; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
            };

            var script = document.createElement('script')
            script.src = `https//${short}.disqus.com/embed.js`;
            script.setAttribute('data-timestamp', +new Date());
            (document.head||document.body).appendChild(script);
            var self = this;

            var script_2 = document.createElement('script')
            script_2.src = `https://${short}.disqus.com/count.js`
            script_2.async = true;
            script_2.id = 'dsq-count-scr';
            (document.head||document.body).appendChild(script_2);

            tmp.loaded = true;
        } else {
            // not first render.
            this.resetComment();
        }
    }

    componentWillReceiveProps(newProps) {

    }

    shouldComponentUpdate(newProps, newState, newContext) {
        return !Map(this.props).equals(Map(newProps))
    }

    componentWillUpdate(newProps, newState, newContext) {
    }

    componentDidUpdate(oldProps, oldState, oldContext) {
        const {identity: oldIdentity} = oldProps
        const {short, identity, force} = this.props
        if (identity && identity !== oldIdentity) {
            this.resetComment();
        }
    }

    componentWillUnmount() {
    }

    static defaultProps = {}
    state = {}
    static propTypes = {
        short: React.PropTypes.string,
        url: React.PropTypes.string,
        title: React.PropTypes.string,
        identity: React.PropTypes.string,
    }
    render() {
        const {url, thread, short, share, nickname, id} = this.props;
        return (
            <div className="__ds-main">
                <div id="disqus_thread"></div>
            </div>
        )
    }
}
