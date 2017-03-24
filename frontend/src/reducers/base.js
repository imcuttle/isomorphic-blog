/**
 * Created by Moyu on 16/10/20.
 */

const initState = {
    fetching: true,
    fetchedConfig: false,
    showBack: false,
    links: [],
    texts: [],
    posts: [],
    items: [],
    prev_next: [],
    post_hasmore: false,
    item_hasmore: false,
    article: {
        title: 'Article',
        fetching: true,
        // date: 'Date'
    },
    nextArticle: undefined
}

export default function (state = initState, action) {
    let newState = {...state};
    switch (action.type) {
        case 'SET_FETCHING':
            return {...newState, fetching: action.fetching};
        case 'SET_FETCHED_CONFIG':
            return {...newState, fetchedConfig: action.fetchedConfig};
        case 'SET_LINKS':
            return {...newState, links: action.links};
        case 'SET_LINKS_TEXTS':
            return {...newState, texts: action.texts};
        case 'SET_PREV_NEXT':
            return {...newState, prev_next: action.prev_next};
        case 'SET_POSTS':
            return {...newState, posts: action.posts};
        case 'SET_ITEMS':
            return {...newState, items: action.items};
        case 'SET_POST_HASMORE':
            return {...newState, post_hasmore: action.hasmore};
        case 'SET_ITEM_HASMORE':
            return {...newState, item_hasmore: action.hasmore};
        case 'SET_ARTICLE':
            return {...newState, article: action.article};
        case 'SET_ARTICLE_FETCHING':
            return {...newState, article: {...newState.article, fetching: action.fetching}};
        case 'SET_NEXT_ARTICLE':
            return {...newState, nextArticle: action.nextArticle};
        case 'SET_SHOW_BACK':
            return {...newState, showBack: action.showBack};
        default:
            return newState;
    }
}