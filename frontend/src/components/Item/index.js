/**
 * Created by Moyu on 16/10/21.
 */
import {Link} from 'react-router'
import React from 'react'
import {Map} from 'immutable'

class Item extends React.Component {

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !Map(this.props).equals(Map(nextProps));
    }

    render() {
        const {picUrl, title, text, href, btnText, hoverHandler} = this.props;
        return (
            <li className="card" onMouseEnter={hoverHandler && hoverHandler.bind(this, picUrl, this.props)}>
                <Link className="card__link" to={href} itemProp="url">
                    <div className="card__img">
                        <figure className="absolute-bg" style={{backgroundImage: "url(\""+picUrl+"\")"}}></figure>
                    </div>
                    <div className="card__container">
                        <h2 className="card__header" itemProp="headline name">{title}</h2>
                        <p className="card__count">{text}</p>
                        <span className="card__more">{btnText}</span>
                    </div>
                </Link>
            </li>
        )
    }
}

export default Item