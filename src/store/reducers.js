import { combineReducers } from 'redux'
import { SET_USER, SET_WEBSOCKET, SET_ONLINELIST, SET_CHATLIST, ADD_CHAT,REFRESH_TOKEN,CHANGE_FORM_STATUS ,SET_MENU} from './actions'

/**
 * 用户信息
 * @param {*} state 
 * @param {*} action 
 */
function user(state = {}, action) {
    switch (action.type) {
        case SET_USER: {
            return action.user
        }
        case REFRESH_TOKEN:{
            console.log('获取预算信息')
        }
        default:
            return state
    }
}

/**
 * 菜单信息信息
 * @param {*} state 
 * @param {*} action 
 * @param menuData 树形列表信息
 */
const defaultMenu = {formStatus:'',formEdit: true,currentId:-1, menuData: []}
function menu(state=defaultMenu,action){
    switch (action.type) {
        case CHANGE_FORM_STATUS:{
            let tmpState = {}
           
            tmpState=Object.assign({},tmpState,{
                formStatus: action.param.formStatus,
                formEdit: action.param.formEdit,
                currentId:action.param.currentId
            })
            return Object.assign({}, state, tmpState)
        }
        case SET_MENU:{
            return Object.assign({}, state, {
                menuData:action.param
            })
        }
        default:
            return state
    }
    console.log(state,action)
}

/**
 * websocket对象
 * @param {*} state 
 * @param {*} action 
 */
function websocket(state = null, action) {
    switch (action.type) {
        case SET_WEBSOCKET: {
            return action.websocket
        }
        default:
            return state
    }
}

/**
 * 在线列表
 * @param {*} state 
 * @param {*} action 
 */
function onlineList(state = [], action) {
    switch (action.type) {
        case SET_ONLINELIST: {
            return action.onlineList
        }
        default:
            return state
    }
}

/**
 * 聊天记录
 * @param {*} state 
 * @param {*} action 
 */
function chatList(state = [], action) {
    switch (action.type) {
        case SET_CHATLIST: {
            return action.chatList
        }
        case ADD_CHAT: {
            return [...state, action.chat]
        }
        default:
            return state
    }
}


const rootReducer = combineReducers({
    user,
    menu,
    websocket,
    onlineList,
    chatList,

})

export default rootReducer 