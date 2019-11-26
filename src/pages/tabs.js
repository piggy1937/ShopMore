import React from 'react'
import LoadableComponent from '../utils/LoadableComponent'
//const Test = React.lazy(() => import('./Test'));   //报错，就没用React.lazy了
const ButtonDemo = LoadableComponent(import('./ButtonDemo/index'), true);
const IconDemo = LoadableComponent(import('./IconDemo/index'), true);
const FeedbackDemo = LoadableComponent(import('./FeedbackDemo/index'), true);
const UsersManager = LoadableComponent(import('./Users/index'), true);
const Collection = LoadableComponent(import('./Collection/index'), true);
const MessageBoard = LoadableComponent(import('./MessageBoard/index'), true);
const Chat = LoadableComponent(import('./Chat/index'), true);
const About = LoadableComponent(import('./About/index'), true);
const BudgetInfo = LoadableComponent(import('./maycur/budget'), true);
const ScheduleInfo = LoadableComponent(import('./maycur/Schedule'), true);
const SyncInfo = LoadableComponent(import('./maycur/sync'), true);
const MenuManager = LoadableComponent(import('./BaseManager/menu-manager'), true);
const RoleTypeManager = LoadableComponent(import('./role/type/index'), true);
const RoleManager     = LoadableComponent(import('./role/role/index'), true);
const FormManager     = LoadableComponent(import('./BaseManager/platform-manager/dynamic-form'), true);
const TemplateManager  = LoadableComponent(import('./BaseManager/platform-manager/template'), true);
const ModelManager  = LoadableComponent(import('./BaseManager/platform-manager/bpmn/ProcessDesign'), true);
const menu = [
    {
       name:'每刻报销',
       icon: 'ant-design',
       code: 'maycurManager',
       authority: 'maycurManager',
       children:[{
        name: '获取预算',
        icon: '',
        code: 'buggetManager',
        authority: 'buggetManager',
       },
           {
               name: '定时轮询',
               icon: '',
               code: 'scheduleManager',
               authority: 'scheduleManager',
           },
           {
               name: '组织架构同步',
               icon: '',
               code: 'orgManager',
               authority: 'orgManager',
           }
       ]
    },
    {
        name: '基础配置管理',
        icon: 'setting',
        code: 'baseManager',
        authority: 'baseManager',
        children: [
            {
                name: '菜单管理',
                icon: 'usergroup-add',
                code: 'menuManager',
                authority: 'menuManager',
            },
            {
                name: '角色权限管理',
                icon: 'usergroup-add',
                code: 'roleManager',
                authority: 'roleManager'
            },
            {
                name: '角色类型管理',
                icon: 'usergroup-add',
                code: 'roleTypeManager',
                authority: 'roleTypeManager'
            },
        ]
    },
    {
        name: '用户管理',
        icon: 'user',
        code: 'usersManager',
        authority: 'usersManager',

    },
    {
        name: '平台设计',
        icon: 'user',
        code: 'platformManager',
        authority: 'platformManager',
        children: [
            {
                name: '表单设计',
                icon: 'user',
                code: 'formManager',
                authority: 'formManager',
        
            },
            {
                name: '模板管理',
                icon: 'user',
                code: 'templateManager',
                authority: 'templateManager',

            }, {
                name: '模型管理',
                icon: 'user',
                code: 'modelManager',
                authority: 'modelManager',

            }
        ]

    }
]
const constantMenuMap=[
    {
    title: '作品集',
    icon: 'bulb',
    code: 'Collection'
},
{
    title: '留言板',
    icon: 'message',
    code: 'MessageBoard'
},
{
    title: '聊天室',
    icon: 'qq',
    code: 'Chat'
},
{
    title: '关于',
    icon: 'info-circle',
    code: 'About'
}]
const tabs = {
    ButtonDemo: <ButtonDemo />,
    IconDemo: <IconDemo />,
    FeedbackDemo: <FeedbackDemo />,
    usersManager: <UsersManager />,
    Collection: <Collection />,
    MessageBoard: <MessageBoard />,
    Chat: <Chat />,
    About: <About />,
    buggetManager:<BudgetInfo/>,
    scheduleManager:<ScheduleInfo/>,
    orgManager:<SyncInfo/>,
    menuManager:<MenuManager/>, //菜单管理界面
    roleTypeManager:<RoleTypeManager/>,
    roleManager:<RoleManager/>,
    formManager:<FormManager/>,
    templateManager:<TemplateManager/>,
    modelManager:<ModelManager/>
}

export {
    menu,
    tabs,
    constantMenuMap
}