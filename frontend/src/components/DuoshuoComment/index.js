import React from 'react'
import {Map} from 'immutable'
import {isBrowser} from '../../common/utils'
var parser = require('ua-parser-js');


const tmp = {}

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.appendComment = this.appendComment.bind(this)
        this.renderShareHTML = this.renderShareHTML.bind(this)
        this.renderShare = this.renderShare.bind(this)
        this.getUaHtml = this.getUaHtml.bind(this)
        this.setPostTemplate = this.setPostTemplate.bind(this)
    }

    componentWillMount() {

    }

    setPostTemplate () {
        const {nickname, id} = this.props;
        var _D_post = DUOSHUO.templates.post;
        DUOSHUO.templates.post =  (e, t) => {
            var rs = _D_post(e, t);
            var agent = e.post.agent;
            if(agent /* && /^Mozilla/.test(agent)*/) {
                rs = rs.replace(/<\/div><p>/, this.getUaHtml(agent) +
                    `${e.post.iplocation ? `<span class="this_ua location"><i class="fa fa-map-marker"></i><span class="ua_text always">${e.post.iplocation}</span></span>` : ''}</div><p>`
                ).replace(/<a\s+class="ds-user-name[\s\S]*?<\/[\s]*a>/, (m, c) => {
                    return m + (id == e.post.author_id ? `<span class="this_ua self"><i class="fa fa-smile-o"></i><span class="ua_text">${nickname || ''}</span></span>` : '')
                })
            }
            return rs;
        }
    }

    getUaHtml(string) {
        var pars = new parser(string);
        var sua = pars.getResult();
        if(sua.os.version=='x86_64') sua.os.version='x64';
        return '<span class="this_ua platform '+sua.os.name+'">'
            +this.uaMapIcon(sua.os.name, sua.device)+'<span class="ua_text">'+sua.os.name+'</span>'
            +'</span>'
            +'<span class="this_ua browser '+sua.browser.name+'">'
            +this.browserMapIcon(sua.browser.name)+'<span class="ua_text">'+sua.browser.name+'</span>'
            +'</span>';
    }

    uaMapIcon(osName, dev) {
        let s = osName.toLowerCase();
        const tpl = t => `<i class="fa fa-${t}" aria-hidden="true"></i>`
        let maps = [
            {t: /(osx|ios|apple|mac)/, v: 'apple'},
            {t: /(windows)/, v: 'windows'},
            {t: /(chrome)/, v: 'chrome'},
            {t: /(android)/, v: 'android'},
            {t: /(qq)/, v: 'qq'},
            {t: /(linux|unix|ubuntu)/, v: 'linux'},
            {t: /(ie)/, v: 'linux'},
            {t: /(safari)/, v: 'safari'},
        ];

        var find = maps.find((x) => x.t.test(s))
        if (find) { return tpl(find.v) }
        else if (dev.type == 'mobile') {
            return tpl('mobile');
        } else {
            return tpl('desktop');
        }
    }

    browserMapIcon (s) {
        s = s.toLowerCase();
        const tpl = t => `<i class="fa fa-${t}" aria-hidden="true"></i>`
        let sames = ['edge', 'firefox'];
        if (sames.includes(s)) return tpl(s);

        let maps = [
            {t: /(osx|ios|apple|mac)/, v: 'apple'},
            {t: /(windows)/, v: 'windows'},
            {t: /(chrome)/, v: 'chrome'},
            {t: /(android)/, v: 'android'},
            {t: /(qq)/, v: 'qq'},
            {t: /(linux|unix|ubuntu)/, v: 'linux'},
            {t: /(ie)/, v: 'linux'},
            {t: /(safari)/, v: 'safari'},
            {t: /[\s\S]*/, v: 'globe'},
        ];

        return tpl(maps.find((x) => x.t.test(s)).v)
    }

    appendComment (props=this.props) {
        const {url, thread, short} = props
        var el = document.createElement('div');
        el.setAttribute('data-thread-key', thread);//必选参数
        el.setAttribute('data-url', url); // 必选参数
        const set = () => {
            DUOSHUO.EmbedThread(el); this.dom.innerHTML=''; this.dom.appendChild(el);
            if(!tmp.__ds_setted) {
                setTimeout(() => {
                    tmp.__ds_setted = true;
                    this.forceUpdate()
                }, 500);
            }
            this.forceUpdate(() => {
                DUOSHUO.initSelector('.ds-share', {type:'ShareWidget'});
            })
        }
        function run () {
            setTimeout(() => {try {set();} catch (ex) {run();}}, 1000)
        }
        run();
    }

    componentDidMount() {
        const {short, thread} = this.props;
        if (isBrowser && !tmp.duoshuoLoaded) {
            window.duoshuoQuery = {short_name: short};
            var script = document.createElement('script')
            script.src = "//static.duoshuo.com/embed.js";
            document.head.appendChild(script);
            var self = this;
            script.onload = script.onreadystatechange = function () {
                if( ! this.readyState || this.readyState=='loaded' || this.readyState=='complete' ) {
                    try {
                        self.setPostTemplate();
                        if (thread) {
                            self.appendComment();
                            DUOSHUO.initSelector('.ds-share', {type:'ShareWidget'});
                        }
                    } catch (ex) {
                        console.log(ex);
                    }
                }
            }
            tmp.duoshuoLoaded = true;
        } else {
            // not first render.
            this.appendComment();
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
        const {thread: oldThread} = oldProps
        const {short, thread, force} = this.props
        if (thread && thread !== oldThread) {
            this.appendComment();
        }
    }

    componentWillUnmount() {
    }

    renderShareHTML () {
        const {url, thread, short, share} = this.props;
        var cls = tmp.__ds_setted ? 'ds-done': 'ds-ing';
        return (
            `<div class="ds-share flat ${cls}" data-thread-key="${thread}" data-title="${share.title}"
                data-images="${share.images}" data-content="${share.content}" data-url="${url}" >
                <div class="ds-share-inline">
                    <ul  class="ds-share-icons-16">
                        <li data-toggle="ds-share-icons-more"><a class="ds-more" href="javascript:void(0);">分享到：</a></li>
                        <li><a class="ds-weibo" href="javascript:void(0);" data-service="weibo">微博</a></li>
                        <li><a class="ds-qzone" href="javascript:void(0);" data-service="qzone">QQ空间</a></li>
                        <li><a class="ds-wechat" href="javascript:void(0);" data-service="wechat">微信</a></li>
                    </ul>
                    <div class="ds-share-icons-more">
                    </div>
                </div>
            </div>`
        )
    }

    renderShare () {
        const {url, thread, short, share} = this.props;
        var cls = tmp.__ds_setted ? 'ds-done': 'ds-ing';
        return (
            <div key={url} className={"ds-share flat "+cls} data-thread-key={thread} data-title={share.title}
                data-images={share.images} data-content={share.content} data-url={url} >
                <div className="ds-share-inline">
                    <ul  className="ds-share-icons-16" style={{height: 30, overflowY: 'hidden'}}>
                        <li data-toggle="ds-share-icons-more"><a className="ds-more" href="javascript:void(0);">分享到：</a></li>
                        <li><a className="ds-weibo" href="javascript:void(0);" data-service="weibo">微博</a></li>
                        <li><a className="ds-qzone" href="javascript:void(0);" data-service="qzone">QQ空间</a></li>
                        <li><a className="ds-wechat" href="javascript:void(0);" data-service="wechat">微信</a></li>
                    </ul>
                    <div className="ds-share-icons-more">
                    </div>
                </div>
            </div>
        )
    }

    static defaultProps = {}
    state = {}
    static propTypes = {}
    render() {
        const {url, thread, short, share, nickname, id} = this.props;
        // <div dangerouslySetInnerHTML={{__html: this.renderShareHTML()}} />
        return (
            <div className="__ds-main">
                { share && isBrowser && this.renderShare() }
                <div ref={r=>this.dom=r} className="__comment-main" />
            </div>
        )
    }
}
