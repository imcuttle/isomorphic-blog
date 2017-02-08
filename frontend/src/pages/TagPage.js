/**
 * Created by moyu on 2017/2/8.
 */
import React from 'react'
import {render} from 'react-dom'
import DocumentTitle from 'react-document-title'
import {renderFrame, isBrowser, positiveHashCode} from '../common/utils'
import BigPic from '../components/BigPic'
import Header from '../components/Header'
import Posts from '../components/Posts'
import Pagination from '../components/Pagination'
import Footer from '../components/Footer'

export default class extends React.Component {

    constructor(props) {
        super(props);
    }
    static contextTypes={
        router: React.PropTypes.object.isRequired
    }
    componentWillMount() {
        const {actions, state} = this.props
    }

    render() {
        const {
            actions, title: mainTitle, params: {tagName},
            state: {
                picture,
                config: {profile, fillCovers, icons, iconTarget},
                base: { posts, showBack, links, texts, prev_next=[]}
            }
        } = this.props
        console.log(showBack)

        return (
            <DocumentTitle title={tagName+' - '+mainTitle}>
                {
                    renderFrame([
                        <BigPic {...picture} showBack={showBack}/>,
                        <div>
                            <Header active="0" links={links} texts={texts} />
                            <div className="tab active">
                                <Posts scroll={false} posts={posts} hoverHandler={(a, k) => actions.setPicBgUrl(a || fillCovers[positiveHashCode(k) % fillCovers.length]) }/>
                                <Pagination prev={prev_next[0]} next={prev_next[1]}/>
                                <Footer icons={icons} method={iconTarget}/>
                            </div>
                        </div>
                    ])
                }
            </DocumentTitle>
        )
    }
}
