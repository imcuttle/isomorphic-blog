/**
 * Created by moyu on 2017/2/8.
 */
import React from 'react'
import {render} from 'react-dom'
import DocumentTitle from 'react-document-title'
import {renderFrame, isBrowser, positiveHashCode} from '../common/utils'
import Article from '../components/Article'
import ArtNext from '../components/ArtNext'

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
            actions, title: mainTitle, params: {hrefTitle},
            state: {
                config: {profile, fillCovers, icons, iconTarget},
                base: { posts, article={}, nextArticle={}, showBack, links, prev_next=[]}
            }
        } = this.props // title, cover, href


        const {tags, content, cover, date, title} = article
        const {key: href, cover: nCover, title: nTitle} = nextArticle
        profile.icons = icons;

        return (
            <DocumentTitle title={'Article - '+mainTitle}>
                <main>
                    <Article
                        title={title} date={date} showBack={showBack}
                        tags={tags} content={content}
                        profile={profile} method={iconTarget}
                        cover={cover || fillCovers[positiveHashCode(hrefTitle) % fillCovers.length]}
                    />
                    {href &&
                        <ArtNext title={nTitle} href={"/article/"+href}
                          cover={nCover || fillCovers[positiveHashCode(nextArticle.key) % fillCovers.length]}
                        />
                    }
                </main>
            </DocumentTitle>
        )
    }
}
