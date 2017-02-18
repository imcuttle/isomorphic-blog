
import React from 'react'
import {Map} from 'immutable'


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
      const props = this.props.json || {};
      props["@context"] = "http://schema.org";
      return (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(props, null, 4)}}>
        </script>
      )
    }
}
