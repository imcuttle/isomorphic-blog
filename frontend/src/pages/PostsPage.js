/**
 * Created by moyu on 2017/2/8.
 */
import React from 'react'
import {render} from 'react-dom'
import {Map} from 'immutable'
import DocumentTitle from 'react-document-title'
import DocumentMeta from 'react-document-meta'

import {renderFrame, isBrowser, positiveHashCode} from '../common/utils'
import BigPic from '../components/BigPic'
import Header from '../components/Header'
import Pagination from '../components/Pagination'
import Footer from '../components/Footer'
import Posts from '../components/Posts'

export default class extends React.Component {

    constructor(props) {
        super(props);
    }
    static contextTypes={
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
            state: {config: {info={}, iconTarget, icons, fillCovers}, picture, base: { texts, posts, showBack, links, prev_next=[]} }
        } = this.props
        const prefix = 'Posts - ';
        const metas = {
            title: prefix + title,
            description: info.description,
            canonical: info.host + pathname,
            meta: {
                charset: 'utf-8',
                name: {
                    keywords: 'posts,'+title,
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
                        <DocumentMeta {...metas} />,
                        <BigPic {...picture} showBack={showBack} />,
                        <div>
                            <Header active="0" links={links} texts={texts} />
                            <div className="tab active">
                                <Posts posts={posts} hoverHandler={(a, k) => {a=a || fillCovers[positiveHashCode(k) % fillCovers.length]; actions.setPicBgUrl(a)} } />
                                <Pagination prev={prev_next[0]} next={prev_next[1]} />
                                <Footer icons={icons} method={iconTarget} />
                            </div>
                        </div>
                    ])
                }
            </DocumentTitle>
        )
    }
}
