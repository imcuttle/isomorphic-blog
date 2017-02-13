/**
 * Created by moyu on 2017/2/13.
 */
if (typeof require.ensure !== 'function') {
    require.ensure = (d, c) => c(require);
}
export default {
    path: 'article/:hrefTitle',
    getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
            cb(null, require('../pages/ArticlePage').default)
        }, 'ArticlePage')
    }
}