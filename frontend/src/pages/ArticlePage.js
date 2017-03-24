/**
 * Created by moyu on 2017/2/8.
 */
import React from "react";
import {render} from "react-dom";
import DocumentTitle from "react-document-title";
import {isBrowser, positiveHashCode} from "../common/utils";
import Article from "../components/Article";
import ArtNext from "../components/ArtNext";
// import SeoImage from "../components/SeoImage";
//
// import IdJson from "../components/IdJson";
import DocumentMeta from "react-document-meta";

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
            actions, title: mainTitle, params: {hrefTitle},
            location: {pathname},
            state: {
                config: {profile, seo = {}, fillCovers, icons, iconTarget, info = {}, seoImage, comment},
                base: {posts, article = {}, nextArticle = {}, showBack, links, prev_next = [], fetchedConfig, fetching}
            }
        } = this.props; // title, cover, href
        const {author = {}} = seo;
        const {name: author_name, image: author_image} = author;
        const {tags, content, cover, date, title, realDate, summary, keywords, mDate} = article;
        const {key: href, cover: nCover, title: nTitle} = nextArticle;
        profile.icons = icons;
        const prefix = title + ' | ';
        let real_date = realDate ? new Date(realDate).toISOString() : null;
        let m_date = mDate ? new Date(mDate).toISOString() : null;
        const metas = {
            title: prefix + mainTitle,
            description: summary,
            canonical: info.host + pathname,
            meta: {
                charset: 'utf-8',
                name: {
                    keywords: 'article,' + mainTitle + ',' + title + (keywords ? ',' + keywords.join(',') : ''),
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
                    "article:published_time": real_date,
                    "article:modified_time": m_date
                }
            }
        };

        const currCover = cover || fillCovers[positiveHashCode(hrefTitle) % fillCovers.length];


        const renderComment = () => {
            let Comment;
            if (comment.enable === 'duoshuo') {
                Comment = require('../components/DuoshuoComment').default;
                return <Comment {...comment.duoshuo}
                                url={(info.host || isBrowser && location.origin) + pathname}
                                thread={hrefTitle}
                                share={{title, images: currCover, content: summary + '...'}}/>
            }
            if (comment.enable === 'disqus') {
                Comment = require('../components/DisqusComment').default;
                return <Comment
                    {...comment.disqus}
                    url={(info.host || isBrowser && location.origin) + pathname}
                    identity={hrefTitle}
                    title={title}
                />
            }
        }

        return (
            <DocumentTitle title={metas.title}>
                <main>
                    <DocumentMeta {...metas} />
                    <Article
                        summary={summary} logo={info.host + info.favicon}
                        publisher={mainTitle} author_img={author_image}
                        author_name={author_name} author_url={info.host + '/'}
                        title={title} date={date} showBack={showBack}
                        tags={tags} content={content} realDate={real_date}
                        profile={profile} method={iconTarget}
                        cover={currCover} mDate={m_date} hrefTitle={hrefTitle}
                    />
                    {fetchedConfig && !article.fetching && renderComment()}
                    {href &&
                    <ArtNext title={nTitle} href={"/article/" + href}
                             cover={nCover || fillCovers[positiveHashCode(nextArticle.key) % fillCovers.length]}
                    />
                    }
                </main>
            </DocumentTitle>
        )
    }


}
