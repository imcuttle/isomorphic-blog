/**
 * Created by Moyu on 16/10/20.
 */
import React from 'react';
import {Link} from 'react-router'
import {Map} from 'immutable'

class ArtNext extends React.Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !Map(this.props).equals(Map(nextProps));
    }
    
    render() {
        const {title, cover, href} = this.props;
        return (
            <section>
                <Link rel="next" title={title} to={href} className="next__link" style={{backgroundImage: cover && 'url('+cover+')'}}>
                    <div className="next__container">
                        <span>Read Next</span>
                        <h2>{title}</h2>
                    </div>
                </Link>
            </section>
        )
    }
}

export default ArtNext;