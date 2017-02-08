/**
 * Created by moyu on 2017/2/8.
 */

export const normalize = (code, result) => ({code, result})

export const checkEntThenResponse = (ent, res, necessary=[]) => {
    if(!necessary.every(key => typeof ent[key] !== 'undefined')) {
        res.json(normalize(400, "参数不正确，必须: "+necessary));
        return false;
    }
    return true;
}

export const testWord = (searchWord, text="") => {
    searchWord = searchWord.trim();
    if(!searchWord) return false;
    return text.search(new RegExp(searchWord, 'i')) >= 0;
}