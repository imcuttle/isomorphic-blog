/**
 * Created by Moyu on 16/10/21.
 */
import {Link} from 'react-router'
import React from 'react'
import {Map} from 'immutable'

class Pagination extends React.Component{

	shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !Map(this.props).equals(Map(nextProps));
    }

	render() {
		const {prev, next} = this.props;

	    return (
	        <div className="pagination">
	            {!!prev && <Link to={prev}>Prev</Link>}
	            {!!next && <Link to={next}>Next</Link>}
	        </div>
	    )
    }
}

export default Pagination