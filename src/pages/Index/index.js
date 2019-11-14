import React from 'react'
import { Layout } from 'antd'
import MySider from './MySider'
import MyHeader from './MyHeader'
import MyContent from './MyContent'
import { getUser, initWebSocket,setMenu } from '@/store/actions'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Map } from 'immutable';
import request from '@/utils/request'
import {menu as asyncMenus} from '@/pages/tabs'
import {filterAsyncRouter} from '@/utils/permission'
import {treeTransArray} from '@/utils/util'
import { menu } from '../tabs'
const { Header, Sider, Content } = Layout;

const store = connect(
    (state) => ({ user: state.user, websocket: state.websocket }),
    (dispatch) => bindActionCreators({ getUser, initWebSocket ,setMenu}, dispatch)
)

@store
class Index extends React.Component {
    //因为这些状态在不同组件中使用了，所以这里使用了状态提升（这里也可以用状态管理,为了学习这里就使用状态提升）
    state = {
        collapsed: false,  //侧边栏的折叠和展开
        panes: [],    //网站打开的标签页列表
        activeMenu: '',  //网站活动的菜单
        theme: localStorage.getItem('theme') || 'dark',   //侧边栏主题
    };
    componentDidMount() {
        this.init()
    }
    componentWillUnmount() {
        const websocket = this.props.websocket
        websocket && websocket.close()
    }
    /**
     * 初始化用户信息和建立websocket连接
     */
    init = async () => {
        const username = localStorage.getItem('username')
        await this.props.getUser({ username })
        const ret = await request({
            methos: 'get',
            url: '/api/admin/menu/tree',
            data: {}
          })
        if(ret.code === 200){
            const treeResult = ret.result||[];
            const result = treeTransArray(treeResult,-1)
            let allMenuMaps = Map({}); //所有菜单
            for (let i = 0; i < result.length; i++) {
                allMenuMaps= allMenuMaps.set(result[i].code, result[i])
              }
             const {menus} = this.props.user //用户可以访问的菜单

             let menuMaps = Map({}); //所有菜单
             for (let i = 0; i < menus.length; i++) {
                menuMaps= menuMaps.set(menus[i].code, menus[i])
               }
               const accessedMenus = filterAsyncRouter(asyncMenus,menuMaps,allMenuMaps)  //用户能够访问的菜单
              this.props.setMenu({
                menuData:result,
                accessedMenus
              })
             
             
        }

        //this.props.initWebSocket(this.props.user)
    }
    _setState = (obj) => {
        this.setState(obj)
    }
    render() {
        const { collapsed, panes, activeMenu, theme } = this.state
        return (
            <Layout style={{ height: '100vh' }}>
                <Sider trigger={null} collapsible collapsed={collapsed} theme={theme}>
                    <MySider
                        theme={theme}
                        panes={panes}
                        activeMenu={activeMenu}
                        onChangeState={this._setState} />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0 }}>
                        <MyHeader
                            theme={theme}
                            collapsed={collapsed}
                            onChangeState={this._setState} />
                    </Header>
                    <Content>
                        <MyContent
                            panes={panes}
                            activeMenu={activeMenu}
                            onChangeState={this._setState} />
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

export default Index