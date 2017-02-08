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
        const {date, title, summary, hrefTitle, hoverHandler, cover} = this.props;
        return (
            <li className="preview" itemProp="post" itemType="http://schema.org/BlogPosting"
                onMouseEnter={hoverHandler && hoverHandler.bind(this, cover, hrefTitle)}
            >
                <Link to={"/article/"+hrefTitle} className="preview__link" itemProp="url">
                    <span className="preview__date" itemProp="datePublished" dateTime={date}>
                        {date}
                    </span>
                    <h2 className="preview__header" itemProp="name">{title}</h2>
                    <p className="preview__excerpt" itemProp="description">
                        {summary+'...'}
                    </p>
                    <span className="preview__more">Read More</span>
                </Link>
            </li>
        )
    }
}

export default Post