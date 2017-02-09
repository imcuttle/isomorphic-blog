/**
 * Created by moyu on 2017/2/8.
 */
import React from 'react'
import {render} from 'react-dom'
import DocumentTitle from 'react-document-title'
import {renderFrame, isBrowser, positiveHashCode} from '../common/utils'
import Article from '../components/Article'
import ArtNext from '../components/ArtNext'
import DocumentMeta from 'react-document-meta';
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
            location: {pathname},
            state: {
                config: {profile, fillCovers, icons, iconTarget, info={}},
                base: { posts, article={}, nextArticle={}, showBack, links, prev_next=[]}
            }
        } = this.props // title, cover, href

        const {tags, content, cover, date, title, realDate, summary} = article
        const {key: href, cover: nCover, title: nTitle} = nextArticle
        profile.icons = icons;
        const prefix =  title + ' - ';
        let real_date = realDate ? new Date(realDate).toISOString() : null;
        const metas = {
            title: prefix + mainTitle,
            description: summary,
            canonical: info.host + pathname,
            meta: {
                charset: 'utf-8',
                name: {
                    keywords: 'article,'+mainTitle+','+title,
                    description: summary,
                    'twitter:card': 'summary',
                    'twitter:description': summary,
                    'twitter:title': title
                },
                itemProp: {
                    name: title,
                    description: summary
                },
                property: {
                    'og:title': title,
                    'og:type': 'article',
                    'og:updated_time': real_date,
                    'og:url': info.host + pathname,
                    'og:site_name': mainTitle,
                }
            }
        };

        return (
            <DocumentTitle title={metas.title}>
                <main>
                    <DocumentMeta {...metas} />
                    <Article
                        title={title} date={date} showBack={showBack}
                        tags={tags} content={content} realDate={real_date}
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
