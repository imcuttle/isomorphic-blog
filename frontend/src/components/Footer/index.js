/**
 * Created by Moyu on 16/10/21.
 */
import {Link} from 'react-router'
import React from 'react'
import {Map} from 'immutable'

class Footer extends React.Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !Map(this.props).equals(Map(nextProps));
    }
    static defaultProps = {
        icons: [],
        method: '_blank'
    }

    render() {
        const {icons, method, copyright} = this.props;
        return (
            <footer className="section-padding--sm footer" style={{position: 'relative'}}>
                <Link className="footer__archive" to="/archive">Archive</Link>
                <ul className="footer__social">
                    {
                        Array.isArray(icons) &&
                        icons.map(icon=>
                            <li key={icon.key}>
                                <a target={method} className={"fa fa-lg fa-"+icon.key} href={icon.url}></a>
                            </li>
                        )
                    }
                </ul>
                <div className="copyright" dangerouslySetInnerHTML={{__html: copyright || ''}} />
            </footer>
        )
    }
}

export default Footer