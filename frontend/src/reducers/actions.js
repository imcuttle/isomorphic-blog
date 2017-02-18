/**
 * Created by Moyu on 16/10/20.
 */

const realFetch = require('isomorphic-fetch')

import {stringify} from "querystring";
import {
    isBrowser,
    isArchivePath,
    isArticlePath,
    isPostsPath,
    isRootPath,
    isTagsPagesPath,
    isTagsPath,
    checkJsonThenLog,
    positiveHashCode
} from "../common/utils";

const _type = (type, obj) => {
    return {
        type,
        ...obj
    }
}

const fetch = isBrowser
    ? (url, options = {}) => realFetch(url, {...options, credentials: 'same-origin'}).catch(err => console.error)
    : (relaUrl, option) => realFetch("http://localhost:" + process.env.PORT + "/" + relaUrl.replace(/^\/+?/, ''), option).catch(err => console.error);


export const pathUpdateEntry = (pathname, params) =>
    (dispatch, getState) => {
        let {config: {pageSize, tagPageSize, summaryNumber}, base: {post_hasmore, links: oldLinks = [], texts}} = getState()
        let {hrefTitle, tagName, page, searchKey} = params;
        let default_left_link = "/posts" + (!isNaN(pageSize) ? '/1' : '');
        let start, prev, next, links = [oldLinks[0] || default_left_link, "/tags" + (!isNaN(tagPageSize) ? '/pages/1' : '/pages')];
        if (isRootPath(pathname) || isPostsPath(pathname)) { // Posts
            page = isNaN(page) ? 1 : page - 0;
            if (isNaN(pageSize)) {
                pageSize = null;
                start = 0;
            } else {
                start = (page - 1) * pageSize;
            }
            prev = start > 0 && page > 1 && '/posts/' + (page - 1)
            links[0] = default_left_link

            dispatch([setLinks(links), setLinksTexts(["Posts", "Tags"])])
            return dispatch(fetchPosts(start, pageSize))
                .then(f => f && dispatch([setShowBack(false), setPrevNext([prev, f.hasmore && '/posts/' + (page - 0 + 1)])]))
        } else if (isArticlePath(pathname) && hrefTitle) {
            return dispatch(fetchArticle(hrefTitle))
                .then(f => f && dispatch(setShowBack(true)))
        } else if (isTagsPath(pathname) && tagName) { // TagPosts
            links[0] = "/tags/" + tagName;
            dispatch([setShowBack(true), setLinksTexts([tagName, "Tags"])]) && dispatch(setPrevNext([])) && dispatch(setLinks(links))
            return dispatch(fetchTagPosts(tagName, 0))
        } else if (isTagsPagesPath(pathname)) {
            page = isNaN(page) ? 1 : page - 0;
            if (isNaN(tagPageSize)) {
                start = 0;
                tagPageSize = null;
            } else {
                start = (page - 1) * tagPageSize;
            }
            prev = start > 0 && page > 1 && '/tags/pages/' + (page - 1)
            dispatch(setLinks(links))
            return dispatch(fetchTags(start, tagPageSize))
                .then(f => f && dispatch([setPrevNext([prev, f.hasmore && '/tags/pages/' + (page - 0 + 1)])]))
        } else if (isArchivePath(pathname)) {
            dispatch([setShowBack(true), setFetching(true)])
            if (searchKey) {
                return dispatch(fetchSearch(searchKey)).then(x => dispatch(setFetching(false)) && x)
            } else {
                return dispatch(fetchArchive()).then(x => dispatch(setFetching(false)) && x)
            }
        }
    }

export const fetchSearch = (word) =>
    (dispatch, getState) =>
    dispatch(setFetching(true)) &&
    fetch("/api/archive-search?" + stringify({word})).then(r => r.json())
        .then(json => {
            const {config: {fillCovers}} = getState();
            if (dispatch(setFetching(false)) && checkJsonThenLog(json)) {
                return dispatch([setItems(json.result.map(k => mapArchiveBox(k, fillCovers)))])
                    && json.result
            }
        })

export const fetchArchive = () =>
    (dispatch, getState) =>
    dispatch(setFetching(true)) &&
    fetch("/api/archive").then(r => r.json())
        .then(json => {
            const {config: {fillCovers}} = getState();
            if (dispatch(setFetching(false)) && checkJsonThenLog(json)) {
                return dispatch([setItems(json.result.map(k => mapArchiveBox(k, fillCovers)))])
                    && json.result
            }
        })

export const fetchPosts = (start, pageSize) =>
    (dispatch) =>
    dispatch(setFetching(true)) &&
    fetch("/api/posts?" + stringify({start, pageSize})).then(r => r.json())
        .then(json =>
            dispatch(setFetching(false)) && checkJsonThenLog(json)
            && dispatch([setPosts(json.result.posts.map(mapPost)), setPostHasMore(json.result.hasmore)])
            && json.result
        )

export const fetchTagPosts = (key, start, pageSize) =>
    (dispatch) =>
    dispatch(setFetching(true)) &&
    fetch('/api/tag-posts?' + stringify({start, pageSize, key})).then(r => r.json())
        .then(json =>
            dispatch(setFetching(false)) && checkJsonThenLog(json)
            && dispatch([setPosts(json.result.posts.map(mapPost)), setPostHasMore(json.result.hasmore)])
            && json.result
        )

export const fetchArticle = (key) =>
    (dispatch) =>
    dispatch(setFetching(true)) &&
    fetch("/api/article?" + stringify({key})).then(r => r.json())
        .then(json => {
            if (dispatch(setFetching(false)) && checkJsonThenLog(json)) {
                json.result.curr && dispatch(setArticle(mapArticle(json.result.curr)));
                json.result.next && dispatch(setNextArticle(mapNextArticle(json.result.next)))
                return json.result;
            }
        })

export const fetchTags = (start, pageSize) =>
    (dispatch, getState) =>
    dispatch(setFetching(true)) &&
    fetch("/api/tags?" + stringify({start, pageSize})).then(r => r.json())
        .then(json => {
            const {config: {fillCovers}} = getState()
            if (dispatch(setFetching(false)) && checkJsonThenLog(json)) {
                dispatch([setItems(json.result.tags.map(k => mapTag(k, fillCovers))), setItemHasMore(json.result.hasmore)]);
                return json.result;
            }
        })


/* map data start */
const mapArchiveBox = ({head: {date, title, cover, realDate, mDate}, key, summary}, fillCovers) => ({
    picUrl: cover || fillCovers[positiveHashCode(key) % fillCovers.length],
    title, text: date, href: "/article/" + key, realDate, summary
})
// const {picUrl, title, text, href, btnText, hoverHandler} = this.props;
const mapTag = ({cover, name, posts = []}, fillCovers) =>
    ({
        picUrl: cover || fillCovers[positiveHashCode(posts[0]) % fillCovers.length],
        title: name, text: posts.length + ' Posts', href: "/tags/" + name
    })
// const {date, title, summary, hrefTitle, hoverHandler, cover} = this.props;
const mapPost = ({summary, key: hrefTitle, head: {cover, date, title, realDate}}) => ({
    hrefTitle,
    realDate,
    cover,
    date,
    title,
    summary
})
// const {title, showBack, date, tags, cover, content, profile, method} = this.props;
const mapArticle = ({content, summary, head: {cover, keywords, date, realDate, mDate, title, tags}}) => ({
    summary,
    tags: Array.isArray(tags) ? tags : (tags ? [tags] : null),
    keywords: Array.isArray(keywords) ? keywords : (keywords ? [keywords] : null),
    content,
    mDate,
    cover,
    realDate,
    date,
    title
})
const mapNextArticle = ({head: {realDate, cover, date, title}, key}) => ({key, cover, date, title, realDate})
/* map data end */

/* base start */
export const setFetching = fetching => _type('SET_FETCHING', {fetching})
export const setFetchedConfig = fetchedConfig => _type('SET_FETCHED_CONFIG', {fetchedConfig})
export const setLinks = links => _type('SET_LINKS', {links})
export const setLinksTexts = texts => _type('SET_LINKS_TEXTS', {texts})
export const setPrevNext = prev_next => _type('SET_PREV_NEXT', {prev_next})
export const setPosts = posts => _type('SET_POSTS', {posts})
export const setItems = items => _type('SET_ITEMS', {items})
export const setItemHasMore = hasmore => _type('SET_ITEM_HASMORE', {hasmore})
export const setPostHasMore = hasmore => _type('SET_POST_HASMORE', {hasmore})
export const setArticle = article => _type('SET_ARTICLE', {article})
export const setNextArticle = nextArticle => _type('SET_NEXT_ARTICLE', {nextArticle})
export const setShowBack = showBack => _type('SET_SHOW_BACK', {showBack})
/* base end */

/* picture start */
export const setPicBgUrl = bgUrl => _type('SET_PIC_BGURL', {bgUrl})
export const setPic = picture => _type('SET_PIC', {picture})
/* picture end */

/* config start */
export const fetchConfig = () =>
    (dispatch, getState) => {
        const {config, base: {fetchedConfig}} = getState();
        if (fetchedConfig) return Promise.resolve(1);
        return dispatch([setPic(config.leftPic), setFetching(true)]) &&
            fetch("/public/config.json")
                .then(r => r.json())
                .then(json =>
                    dispatch(setConfig(json)) && dispatch(setPic(json.leftPic)) && dispatch(setFetching(false)) && dispatch(setFetchedConfig(true))
                )
    }

export const setConfig = (config) => _type('SET_CONFIG', {config})
/* config end */


/* functions set start */
function getLinks(pageSize, tagPageSize) {
    let links = ["/posts" + (pageSize != null ? '/1' : ''), "/tags" + (tagPageSize != null ? '/pages/1' : '')]
    return links;
}

/* functions set end */
