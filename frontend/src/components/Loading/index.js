import React from 'react'
import {Map} from 'immutable'
import {isBrowser} from '../../common/utils'

export default class extends React.Component {
    constructor(props) {
        super(props)
    }
    componentWillMount() {}
    componentDidMount() {}
    componentWillReceiveProps(newProps) {}
    shouldComponentUpdate(newProps, newState, newContext) {
        return !Map(this.props).equals(Map(newProps))
    }
    componentWillUpdate(newProps, newState, newContext) {}
    componentDidUpdate(oldProps, oldState, oldContext) {}
    componentWillUnmount() {}
    static defaultProps = {}
    state = {}
    static propTypes = {}
    render() {
        const {text='', show=true} = this.props
        const style = !show ? {display: 'none'} : {}
        return (
            <div className="inner-loading" style={style} >
                <div className="inner-loading-object inner-loading-object_one"></div>
                <div className="inner-loading-object inner-loading-object_two"></div>
                <div className="inner-loading-object inner-loading-object_three"></div>
                <h3 className="inner-loading-text">{text}</h3>
            </div>
        )
    }
}
