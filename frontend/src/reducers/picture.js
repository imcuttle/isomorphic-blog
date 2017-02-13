/**
 * Created by Moyu on 16/10/20.
 */

const initState = {
    bgColor: '#000',
    bgUrl: '',
    lgText: 'LGTEXT',
    smText: 'SMTEXT'
}

export default function (state = initState, action) {
    let newState = {...state}
    switch (action.type) {
        case 'SET_PIC_BGURL':
            return {...newState, bgUrl: action.bgUrl};
        case 'SET_PIC':
            return {...newState, ...action.picture}
        default:
            return newState;
    }
}