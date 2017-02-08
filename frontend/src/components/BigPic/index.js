/**
 * Created by Moyu on 16/10/20.
 */
import React from 'react';
import {Link} from 'react-router'
import { connect } from 'react-redux'
import {Map} from 'immutable'

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');


class BigPic extends React.Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        
        return !Map(this.props).equals(Map(nextProps));
    }
    componentWillUpdate(nextProps, nextState, nextContext) {}
    componentWillReceiveProps(nextProps) {}
    componentDidMount() {
        
    }
    componentDidUpdate(prevProps, prevState) {
        this.refs.bg.style.display='none';
        setTimeout(()=>{
            this.refs.bg.style.display='';
        }, 20)
        
    }
    componentWillUnmount() {}
    static defaultProps = {
        smText: 'welcome to',
        lgText: 'Here de',
        showBack: false
    }
    static propTypes = {
        bgUrl: React.PropTypes.string,
        bgColor: React.PropTypes.string,
        smText: React.PropTypes.string,
        lgText: React.PropTypes.string
    }

    render() {
        const {bgUrl, bgColor, smText, lgText, showBack} = this.props;
        // console.log('BigPic', bgUrl)
        return (
            <div style={{backgroundColor: bgColor}}>
            {
                !!showBack &&
                <Link className="nav nav--white" to="/">
                  <i className="fa fa-lg fa-arrow-left"></i>
                  <span>Back to Posts</span>
                </Link>
            }
            <ReactCSSTransitionGroup 
              transitionName="example" 
              transitionEnterTimeout={500} 
              transitionLeaveTimeout={300}>
              <figure ref="bg" className="animated fadeIn absolute-bg preview__img" style={{backgroundImage: bgUrl&&"url("+bgUrl+")"}}></figure>
            </ReactCSSTransitionGroup>
                <div className="previews__container">
                    <span>{smText}</span>
                    <h1>{lgText}</h1>
                </div>
            </div>
        )
    }


}

export default BigPic;