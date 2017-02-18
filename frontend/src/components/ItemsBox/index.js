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
        document.body.scrollTop = 0;
        const {scroll} = this.props;
        if(scroll) {
            // document.body.scrollTop = 0;
        } else {
            // let text = sessionStorage['@@History/'+this.context.location.key]
            // if(!!text) {
            //     // document.body.scrollTop = JSON.parse(text).top
            // }
        }
        if(this.refs.ul) {
            // this.refs.ul.style.visibility = 'hidden';
            setTimeout(()=> {
                if (this && this.refs && this.refs.ul) {
                    this.refs.ul.classList.remove('active')
                    // this.refs.ul.classList.add('fadeIn')
                    this.refs.ul.style.visibility = '';
                }
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
            const {author_name, author_img, logo, publisher, author_url} = this.props;
            return (
                <div className="section-padding archives__container">
                    {
                        items && items.map((item, i)=>
                            <article key={i} className="card" itemScope itemType="//schema.org/BlogPosting">
                            <Link onClick={e=>{
                                {/*this.context.router.setState({top: document.body.scrollTop});*/}
                            }} className="card__link" to={{pathname: item.href}} itemProp="url">
                                <div itemType="//schema.org/Person" itemScope style={{display: 'none'}} itemProp="author">
                                    <span itemProp="name">{author_name}</span>
                                    <span itemProp="url">{author_url}</span>
                                    <span itemProp="image" itemScope itemType="//schema.org/imageObject">
                                        <span itemProp="url">{author_img}</span>
                                    </span>
                                </div>
                                <div itemType="//schema.org/imageObject" itemScope style={{display: 'none'}} itemProp="image">
                                    <img itemProp="url" src={item.picUrl} title={item.title} alt={item.title} />
                                    <span itemProp="width">500</span><span itemProp="height">500</span>
                                </div>
                                <meta itemProp="mainEntityOfPage" content={item.href}/>
                                <div itemType="//schema.org/Organization" itemScope style={{display: 'none'}} itemProp="publisher">
                                    <span itemProp="name">{publisher}</span>
                                    <span itemProp="logo" itemType="//schema.org/imageObject" itemScope>
                                        <meta itemProp="url" content={logo} />
                                        {/*<meta itemProp="width" content="50" />*/}
                                        {/*<meta itemProp="height" content="50" />*/}
                                    </span>
                                </div>
                                <meta itemProp="description" content={item.summary+'...'}/>
                                <div className="card__img">
                                    <figure className="absolute-bg wow" 
                                    style={{
                                        backgroundImage: item.picUrl && "url("+item.picUrl+")",
                                        animationName: 'fade-in'}}>
                                    </figure>
                                </div>
                                <div className="card__container">
                                    <h2 className="card__header" itemProp="name headline">{item.title}</h2>
                                    <p className="card__count" itemProp="datePublished" content={item.realDate}>{item.text}</p>
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