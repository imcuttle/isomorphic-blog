/**
 * Created by moyu on 2017/2/8.
 */
import React from 'react'
import {render} from 'react-dom'
import {Link} from 'react-router'
import DocumentTitle from 'react-document-title'
import {isBrowser} from '../common/utils'

import ItemsBox from '../components/ItemsBox'
import DocumentMeta from 'react-document-meta';
import SeoImage from '../components/SeoImage'

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
        const {router} = this.context;
        const {
            title, params: {searchKey}, location: {pathname},
            state: {
                config: {info={}, seoImage},
                base: {items}
            }
        } = this.props;

        const tags = {
            title: 'Archive - '+ title,
            description: info.description,
            canonical: info.host + pathname,
            meta: {
                charset: 'utf-8',
                name: {
                    keywords: 'archive,'+title,
                    description: info.description,
                    'twitter:card': 'summary',
                    'twitter:description': info.description,
                    'twitter:title': 'Archive'
                },
                itemProp: {
                    name: 'Archive',
                    description: info.description
                },
                property: {
                    'og:title': 'Archive',
                    'og:type': 'website',
                    'og:url': info.host + pathname,
                    'og:site_name': title,
                }
            }
        };

        return (
            <DocumentTitle title={tags.title}>
                <main>
                    <DocumentMeta {...tags} />
                    {seoImage && <SeoImage title={'Archive'} src={seoImage} />}
                    <section className="archives animated fadeIn">
                        <Link className="nav nav--black" to="/">
                            <i className="fa fa-lg fa-arrow-left"></i>
                            <span>Back to Posts</span>
                        </Link>
                        <span className="archives_right">
                            <span>{ items.length }</span>
                            <i className="fa fa-lg fa-file-text"></i>
                        </span>
                        <header className="archives__header">
                            <span>{'Archive'}</span>
                        </header>
                        <div className="serach-div">
                            <input placeholder="Serach..." defaultValue={searchKey} spellCheck={false} autoCorrect='off'
                                   onChange={e=>{
                                       router.push('/archive/'+encodeURIComponent(e.target.value.trim()));
                                   }}
                            />
                        </div>
                    </section>
                        <ItemsBox big={true} scroll={false} btnText="Read Post" items={items} />
                </main>
            </DocumentTitle>
        )
    }
}
