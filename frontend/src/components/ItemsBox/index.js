/**
 * Created by Moyu on 16/10/20.
 */
import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import {Map} from 'immutable'

import Item from '../Item'

class ItemsBox extends React.Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !Map(this.props).equals(Map(nextProps));
    }
    componentWillUpdate(nextProps, nextState, nextContext) {

    }
    componentWillReceiveProps(nextProps) {}
    componentDidMount() {
        const {scroll} = this.props;
        if(scroll) {
            document.body.scrollTop = 0;
        } else {
            // let text = sessionStorage['@@History/'+this.context.location.key]
            // if(!!text) {
            //     // document.body.scrollTop = JSON.parse(text).top
            // }
        }
        if(this.refs.ul) {
            // this.refs.ul.style.visibility = 'hidden';
            setTimeout(()=> {
                this.refs.ul.classList.remove('active')
                // this.refs.ul.classList.add('fadeIn')
                this.refs.ul.style.visibility = '';
            }, 1200)

        }
    }
    componentDidUpdate(prevProps, prevState) {}
    componentWillUnmount() {

    }
    static defaultProps = {
        scroll: true
    }

    static contextTypes = {
        router: React.PropTypes.object.isRequired,
    }
    render() {
        const {items, btnText, hoverHandler, big} = this.props;
        if(!big) {
            return (
                <div ref="ul" className="tab active">
                <ul className="cards">
                    {
                        items.map((item, i)=>
                            <Item key={i} {...item} btnText={btnText} hoverHandler={hoverHandler}/>
                        )
                    }
                </ul>
                </div>
            )
        } else {
            return (
                <div className="section-padding archives__container">
                    {
                        items && items.map((item, i)=>
                            <article key={i} className="card">
                            <Link onClick={e=>{
                                {/*this.context.router.setState({top: document.body.scrollTop});*/}
                            }} className="card__link" to={{pathname: item.href}} itemProp="url">
                                <div className="card__img">
                                    <figure className="absolute-bg wow" 
                                    style={{
                                        backgroundImage: item.picUrl && "url("+item.picUrl+")",
                                        animationName: 'fade-in'}}>
                                    </figure>
                                    </div>
                                    <div className="card__container">
                                    <h2 className="card__header" itemProp="name">{item.title}</h2>
                                    <p className="card__count" itemProp="datePublished">{item.text}</p>
                                    <span className="card__more">{btnText}</span>
                                </div>
                            </Link>
                            </article>
                        )
                    }
                </div>
            )
        }
    }


}

export default ItemsBox;