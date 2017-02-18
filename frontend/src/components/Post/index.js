/**
 * Created by Moyu on 16/10/21.
 */
import {Link} from 'react-router'
import React from 'react'
import {Map} from 'immutable'
import {renderFrame, positiveHashCode} from "../../common/utils";

class Post extends React.Component {

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !Map(this.props).equals(Map(nextProps));
    }

    render() {
        let {
            date, title, summary, hrefTitle, hoverHandler, cover, realDate,
            publisher, logo, author_url, author_name, author_img, fillCovers
        } = this.props;

        cover = cover || fillCovers[positiveHashCode(hrefTitle) % fillCovers.length]
        const dateStr = realDate && new Date(realDate).toISOString();
        return (
            <li className="preview" itemProp="post" itemScope itemType="//schema.org/BlogPosting"
                onMouseEnter={hoverHandler && hoverHandler.bind(this, cover)}
            >
                <article>
                <Link to={"/article/"+hrefTitle} rel="contents" className="preview__link" itemProp="url" >
                    <span className="preview__date" itemProp="datePublished" dateTime={dateStr} content={dateStr && dateStr.substr(0, 10)} >
                        {date}
                    </span>
                    <h2 className="preview__header" itemProp="headline name">{title}</h2>
                    <p className="preview__excerpt" itemProp="description">
                        {summary+'...'}
                    </p>

                    <div itemType="//schema.org/Organization" itemScope style={{display: 'none'}} itemProp="publisher">
                        <span itemProp="name">{publisher}</span>
                        <meta itemProp="logo" content={logo} />
                    </div>
                    <div itemType="//schema.org/Person" itemScope style={{display: 'none'}} itemProp="author">
                        <meta itemProp="name" content={author_name}/>
                        <meta itemProp="url" content={author_url}/>
                        <span itemProp="image" itemScope itemType="//schema.org/imageObject">
                            <meta itemProp="url" content={author_img}/>
                        </span>
                    </div>
                    <div itemType="//schema.org/imageObject" itemScope style={{display: 'none'}} itemProp="image">
                        <img itemProp="url" src={cover} title={title} alt={title} />
                        <meta itemProp="width" content="500"/>
                        <meta itemProp="height" content="500"/>
                    </div>

                    <span className="preview__more">Read More</span>
                </Link>
                </article>
            </li>
        )
    }
}

export default Post