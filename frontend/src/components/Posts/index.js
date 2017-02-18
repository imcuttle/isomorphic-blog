/**
 * Created by Moyu on 16/10/20.
 */
import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Map} from 'immutable'

import Post from '../Post'

class Posts extends React.Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !Map(this.props).equals(Map(nextProps));
    }
    componentWillUpdate(nextProps, nextState, nextContext) {}
    componentWillReceiveProps(nextProps) {}
    componentDidMount() {
        const {scroll} = this.props;
        if(scroll) {
            document.body.scrollTop = 0;
        }
    }
    componentDidUpdate(prevProps, prevState) {
        // if(this.refs && this.refs.div) {
        //     this.refs.div.style.display='none';
        //     setTimeout(()=>{
        //         this.refs.div.style.display='';
        //     }, 0)
        // }
    }
    componentWillUnmount() {}
    static defaultProps = {
        scroll: false
    }
    render() {
        const {posts, hoverHandler, ...rest} = this.props;

        return (
            <div ref="div" className="tab active">
                <ul ref="ul" >
                    {
                        Array.isArray(posts)
                        && posts.map(post =>
                            <Post key={post.hrefTitle} {...rest} {...post} hoverHandler={hoverHandler}/>
                        )
                    }
                </ul>
            </div>
        )
    }


}

export default Posts;