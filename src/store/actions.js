import React from 'react'
import  request  from '@/utils/request'
import {logout,authenticateSuccess,isAuthenticated} from '@/utils/session'
import { notification, Avatar } from 'antd'
import { replaceImg } from '../utils/util'
import history  from '@/utils/history'
// 虽然用户信息放在localStorage也可以全局使用，但是如果放在localStorage中，用户信息改变时页面不会实时更新
export const SET_USER = 'SET_USER'
export function setUser(user) {
    return {
        type: SET_USER,
        user
    }
}
//异步刷新token ,防止token 失效
export const REFRESH_TOKEN = 'refresh_token'
export async function refreshToken(params)
{
   let auth = isAuthenticated()
     let  res
     try{
     res =  await request({
        headers: {
            'Authorization': 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0',
        },
        method: 'post',
        url: '/oauth/token?grant_type=refresh_token',
        data: {
            refresh_token: auth.refresh_token
        }
     })
     if(res.error) {
         //用于刷新的token 过期
         localStorage.setItem('username', {}) 
         logout()
     }
     if(res.access_token){
         //刷新token 成功
         await authenticateSuccess(JSON.stringify(res))
         let currentTime =  Date.now()/1000;
         localStorage.setItem('expires_time',currentTime +res.expires_in)
         // Replay request
        const {method,url} = params.initialRequest
        try{
        const ret2 = await request({
            method,
            url
        })
        params.resolve(ret2);
       }catch(e){
        params.reject(e);
       }
        
     }

    }catch(e){
        //获取出错
        console.log(e)
        logout()
        history.push('/login')
    }
     




}



//异步action，从后台获取用户信息
export function getUser(param) {
    return async function (dispatch) {
        const res ={}// await json.get('/user/getUser', param)
        dispatch(setUser(res.data || {}))
    }
}

export const SET_WEBSOCKET = 'SET_WEBSOCKET'  //设置websocket对象
export function setWebsocket(websocket) {
    return {
        type: SET_WEBSOCKET,
        websocket
    }
}


export function initWebSocket(user) {    //初始化websocket对象
    return async function (dispatch) {
        const websocket = new WebSocket("ws://" + window.location.hostname + ":8081")
        //建立连接时触发
        websocket.onopen = function () {
            const data = {
                id: user.id,
                username: user.username,
                avatar: user.avatar
            }
            //当用户第一次建立websocket链接时，发送用户信息到后台，告诉它是谁建立的链接
            websocket.send(JSON.stringify(data))
        }
        //监听服务端的消息事件
        websocket.onmessage = function (event) {
            const data = JSON.parse(event.data)
            //在线人数变化的消息
            if (data.type === 0) {
                dispatch(setOnlinelist(data.msg.onlineList))
                data.msg.text && notification.info({
                    message: '提示',
                    description: data.msg.text
                })
            }
            //聊天的消息
            if (data.type === 1) {
                dispatch(addChat(data.msg))
                notification.open({
                    message: data.msg.username,
                    description: <div dangerouslySetInnerHTML={{ __html: replaceImg(data.msg.content) }} />,
                    icon: <Avatar src={data.msg.userAvatar} />
                })
            }
            console.log(11, data)
        }
        dispatch(setWebsocket(websocket))
        dispatch(initChatList())
    }
}

export const SET_ONLINELIST = 'SET_ONLINELIST'   //设置在线列表
export function setOnlinelist(onlineList) {
    return {
        type: SET_ONLINELIST,
        onlineList
    }
}

//异步action，初始化聊天记录列表
export function initChatList() {
    return async function (dispatch) {
        const res ={} // await json.get('/chat/list')
        dispatch(setChatList(res.data || []))
    }
}

export const SET_CHATLIST = 'SET_CHATLIST'
export function setChatList(chatList) {
    return {
        type: SET_CHATLIST,
        chatList
    }
}

export const ADD_CHAT = 'ADD_CHAT'
export function addChat(chat) {
    return {
        type: ADD_CHAT,
        chat
    }
}