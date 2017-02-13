/**
 * Created by moyu on 2017/2/8.
 */
import React from "react";
import {render} from "react-dom";
import DocumentTitle from "react-document-title";
import DocumentMeta from "react-document-meta";
import {renderFrame, positiveHashCode} from "../common/utils";
import BigPic from "../components/BigPic";
import Header from "../components/Header";
import Posts from "../components/Posts";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import SeoImage from "../components/SeoImage";

export default class extends React.Component {

    constructor(props) {
        super(props);
    }

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    componentWillMount() {
        const {actions, state} = this.props
    }

    render() {
        const {
            actions, title: mainTitle, params: {tagName}, location: {pathname},
            state: {
                picture,
                config: {info = {}, profile, fillCovers, icons, iconTarget, seoImage, copyright},
                base: {posts, showBack, links, texts, prev_next = []}
            }
        } = this.props

        const prefix = 'Tag: ' + tagName + ' | ';
        const metas = {
            title: prefix + mainTitle,
            description: info.description,
            canonical: info.host + pathname,
            meta: {
                charset: 'utf-8',
                name: {
                    keywords: 'posts,' + mainTitle + ',' + tagName,
                    description: info.description,
                    'twitter:card': 'summary',
                    'twitter:description': info.description,
                    'twitter:title': tagName
                },
                itemProp: {
                    name: tagName,
                    description: info.description
                },
                property: {
                    'og:title': tagName,
                    'og:type': 'site',
                    'og:url': info.host + pathname,
                    'og:site_name': mainTitle,
                }
            }
        };

        return (
            <DocumentTitle title={metas.title}>
                {
                    renderFrame([
                        <DocumentMeta {...metas} />,
                        <BigPic {...picture} showBack={showBack}/>,
                        seoImage ? <SeoImage title={'Tag: ' + tagName} src={seoImage}/> : null,
                        <div>
                            <Header active="0" links={links} texts={texts}/>
                            <div className="tab active">
                                <Posts scroll={false} posts={posts}
                                       hoverHandler={(a, k) => actions.setPicBgUrl(a || fillCovers[positiveHashCode(k) % fillCovers.length]) }/>
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
