/**
 * Created by Moyu on 16/10/21.
 */
import {Link} from 'react-router'
import React from 'react'
import {Map} from 'immutable'

class Post extends React.Component {

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !Map(this.props).equals(Map(nextProps));
    }

    render() {
        const {
            date, title, summary, hrefTitle, hoverHandler, cover, realDate,
            publisher, logo, author_url, author_name, author_img
        } = this.props;
        const dateStr = realDate && new Date(realDate).toISOString();
        return (
            <li className="preview" itemProp="post" itemScope itemType="//schema.org/BlogPosting"
                onMouseEnter={hoverHandler && hoverHandler.bind(this, cover, hrefTitle)}
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
                        <span itemProp="name">{author_name}</span>
                        <span itemProp="url">{author_url}</span>
                        <span itemProp="image" itemScope itemType="//schema.org/imageObject">
                            <span itemProp="url">{author_img}</span>
                        </span>
                    </div>
                    <div itemType="//schema.org/imageObject" itemScope style={{display: 'none'}} itemProp="image">
                        <img itemProp="url" src={cover} title={title} alt={title} />
                        <span itemProp="width">500</span><span itemProp="height">500</span>
                    </div>

                    <span className="preview__more">Read More</span>
                </Link>
                </article>
            </li>
        )
    }
}

export default Post