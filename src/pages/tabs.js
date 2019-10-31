import React from 'react'
import LoadableComponent from '../utils/LoadableComponent'
//const Test = React.lazy(() => import('./Test'));   //报错，就没用React.lazy了
const ButtonDemo = LoadableComponent(import('./ButtonDemo/index'), true);
const IconDemo = LoadableComponent(import('./IconDemo/index'), true);
const FeedbackDemo = LoadableComponent(import('./FeedbackDemo/index'), true);
const Users = LoadableComponent(import('./Users/index'), true);
const Collection = LoadableComponent(import('./Collection/index'), true);
const MessageBoard = LoadableComponent(import('./MessageBoard/index'), true);
const Chat = LoadableComponent(import('./Chat/index'), true);
const About = LoadableComponent(import('./About/index'), true);
const BudgetInfo = LoadableComponent(import('./maycur/budget'), true);
const ScheduleInfo = LoadableComponent(import('./maycur/Schedule'), true);
const SyncInfo = LoadableComponent(import('./maycur/sync'), true);
const MenuManager = LoadableComponent(import('./BaseManager/menu-manager'), true);
const menu = [
    {
       name:'每刻报销',
       icon: 'ant-design',
       key: 'budget',
       children:[{
        name: '获取预算',
        icon: '',
        key: 'BudgetInfo',
       },
           {
               name: '定时轮询',
               icon: '',
               key: 'ScheduleInfo',
           },
           {
               name: '组织架构同步',
               icon: '',
               key: 'SyncInfo',
           }
       ]
    },
    {
        name: '基础配置管理',
        icon: 'setting',
        key: 'baseManager',
        children: [
            {
                name: '菜单管理',
                icon: 'usergroup-add',
                key: 'menuManager',
            },
            {
                name: '角色权限管理',
                icon: 'usergroup-add',
                key: 'IconDemo',
            },
            {
                name: '角色类型管理',
                icon: 'usergroup-add',
                key: 'FeedbackDemo',
            },
        ]
    },
    {
        name: '用户管理',
        icon: 'user',
        key: 'Users'
    },
    {
        name: '作品集',
        icon: 'bulb',
        key: 'Collection'
    },
    {
        name: '留言板',
        icon: 'message',
        key: 'MessageBoard'
    },
    {
        name: '聊天室',
        icon: 'qq',
        key: 'Chat'
    },
    {
        name: '关于',
        icon: 'info-circle',
        key: 'About'
    }
]

const tabs = {
    ButtonDemo: <ButtonDemo />,
    IconDemo: <IconDemo />,
    FeedbackDemo: <FeedbackDemo />,
    Users: <Users />,
    Collection: <Collection />,
    MessageBoard: <MessageBoard />,
    Chat: <Chat />,
    About: <About />,
    BudgetInfo:<BudgetInfo/>,
    ScheduleInfo:<ScheduleInfo/>,
    SyncInfo:<SyncInfo/>,
    menuManager:<MenuManager/> //菜单管理界面
}

export {
    menu,
    tabs
}