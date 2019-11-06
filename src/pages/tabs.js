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
const RoleTypeManager = LoadableComponent(import('./role/type/index'), true);
const menu = [
    {
       name:'每刻报销',
       icon: 'ant-design',
       key: 'maycurManager',
       children:[{
        name: '获取预算',
        icon: '',
        key: 'buggetManager',
       },
           {
               name: '定时轮询',
               icon: '',
               key: 'scheduleManager',
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
        authority: 'baseManager',
        children: [
            {
                name: '菜单管理',
                icon: 'usergroup-add',
                key: 'menuManager',
                authority: 'menuManager',
            },
            {
                name: '角色权限管理',
                icon: 'usergroup-add',
                key: 'IconDemo',
                authority: 'groupManager'
            },
            {
                name: '角色类型管理',
                icon: 'usergroup-add',
                key: 'RoleTypeInfo',
                authority: 'groupTypeManager'
            },
        ]
    },
    {
        name: '用户管理',
        icon: 'user',
        key: 'Users',
        authority: 'userManager'
    }
]
const constantMenuMap=[
    {
    title: '作品集',
    icon: 'bulb',
    key: 'Collection'
},
{
    title: '留言板',
    icon: 'message',
    key: 'MessageBoard'
},
{
    title: '聊天室',
    icon: 'qq',
    key: 'Chat'
},
{
    title: '关于',
    icon: 'info-circle',
    key: 'About'
}]
const tabs = {
    ButtonDemo: <ButtonDemo />,
    IconDemo: <IconDemo />,
    FeedbackDemo: <FeedbackDemo />,
    Users: <Users />,
    Collection: <Collection />,
    MessageBoard: <MessageBoard />,
    Chat: <Chat />,
    About: <About />,
    buggetManager:<BudgetInfo/>,
    scheduleManager:<ScheduleInfo/>,
    orgManager:<SyncInfo/>,
    menuManager:<MenuManager/>, //菜单管理界面
    roleTypeManager:<RoleTypeManager/>
}

export {
    menu,
    tabs,
    constantMenuMap
}