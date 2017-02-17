/**
 * Created by moyu on 2017/2/8.
 */
import express from 'express'
import {getArticle, searchFilter, getArchive, getDataBase, getPosts, getTagPosts, getTags} from '../lib/space_processing'
import { normalize, checkEntThenResponse } from '../lib/utils'

const api = express();

const work_flow = (req, res, necessary, getData) => {
    const ent = req.ent;
    if (checkEntThenResponse(ent, res, necessary)) {
        const data = getData && getData(ent);
        if (data) {
            res.normalize(200, data);
        } else {
            res.normalize(404, req.originalUrl + ' -> 失败');
        }
    }
}

api.get('/posts', (req, res) => work_flow(req, res, ["start"], ({start, pageSize, summaryNumber}) => getPosts(start-0, pageSize, summaryNumber) ))

api.get('/article', (req, res) => work_flow(req, res, ["key"], ({key}) => getArticle(key) ))

api.get('/tags', (req, res) => work_flow(req, res, ["start"], ({start, pageSize}) => getTags(start-0, pageSize) ))

api.get('/tag-posts', (req, res) => work_flow(req, res, ["key", "start"], ({key, start, pageSize, summaryNumber}) => getTagPosts(key, start, pageSize, summaryNumber) ))

api.get('/archive', (req, res) => work_flow(req, res, [], getArchive ) )

api.get('/archive-search', (req, res) => work_flow(req, res, ["word"], ({word}) => searchFilter(word) ))

api.get('/database', (req, res) => work_flow(req, res, [], getDataBase ) )

export default api;