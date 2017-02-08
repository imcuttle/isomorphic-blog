/**
 * Created by moyu on 2017/2/8.
 */
import React from 'react'
import {render} from 'react-dom'
import {Map} from 'immutable'
import DocumentTitle from 'react-document-title'

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
        const {actions, title, state: {config: {iconTarget, icons, fillCovers}, picture, base: { texts, posts, showBack, links, prev_next=[]} } } = this.props
        // console.log('render', this.props.state);
        return (
            <DocumentTitle title={'Posts - '+title}>
                {
                    renderFrame([
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
