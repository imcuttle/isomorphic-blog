/**
 * Created by moyu on 2017/2/8.
 */
import React from "react";
import {render} from "react-dom";
import {Map} from "immutable";
import DocumentTitle from "react-document-title";
import DocumentMeta from "react-document-meta";
import {renderFrame, positiveHashCode} from "../common/utils";
import BigPic from "../components/BigPic";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import Posts from "../components/Posts";
import SeoImage from "../components/SeoImage";

export default class extends React.Component {

    constructor(props) {
        super(props);
    }

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    shouldComponentUpdate(newProps) {
        return !Map(newProps.state).equals(Map(this.props.state)) || newProps.location.pathname !== this.props.location.pathname;
    }

    componentWillReceiveProps(newProps) {

    }

    componentWillMount() {
        const {actions, state} = this.props
    }

    render() {
        const {
            actions, title, location: {pathname},
            state: {config: {info = {}, seo={}, copyright, iconTarget, icons, seoImage, fillCovers}, picture, base: {texts, posts, showBack, links, prev_next = []}}
        } = this.props;
        const {author={}} = seo;
        const {name: author_name, image: author_image} = author;
        const prefix = 'Posts | ';
        const metas = {
            title: prefix + title,
            description: info.description,
            canonical: info.host + pathname,
            meta: {
                charset: 'utf-8',
                name: {
                    keywords: 'posts,' + title,
                    description: info.description,
                    'twitter:card': 'summary',
                    'twitter:description': info.description,
                    'twitter:title': 'Posts'
                },
                itemProp: {
                    name: 'Posts',
                    description: info.description
                },
                property: {
                    'og:title': 'Posts',
                    'og:type': 'site',
                    'og:url': info.host + pathname,
                    'og:site_name': title,
                }
            }
        };
        return (
            <DocumentTitle title={metas.title}>
                {
                    renderFrame([
                        <DocumentMeta {... metas} />,
                        <BigPic {...picture} showBack={showBack}/>,
                        seoImage ? <SeoImage title={'Posts'} src={seoImage}/> : null,
                        <div>
                            <Header active="0" links={links} texts={texts}/>
                            <div className="tab active">
                                <Posts posts={posts} fillCovers={fillCovers}
                                       publisher={title} logo={info.host+info.favicon}
                                       author_url={info.host+'/'} author_name={author_name} author_img={author_image}
                                       hoverHandler={(a) => {
                                    actions.setPicBgUrl(a)
                                } }/>
                                <Pagination prev={prev_next[0]} next={prev_next[1]}/>
                                <Footer icons={icons} method={iconTarget} copyright={copyright}/>
                            </div>
                        </div>
                    ])
                }
            </DocumentTitle>
        )
    }
}
