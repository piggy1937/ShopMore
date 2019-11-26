import React from 'react'
import { Menu, Icon } from 'antd'
import { tabs, constantMenuMap } from '../tabs'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import {List} from 'immutable'
const store = connect(
    (state) => ({ accessedMenus:state.menu.accessedMenus,
        activeMenu:state.menu.activeMenu }),
    (dispatch) => bindActionCreators({ }, dispatch)
)
@store
class MySider extends React.Component {
    /**
     * 生成侧边栏菜单
     */
    constructor(props){
        super(props)
    }
   
    renderMenu = (menu) => {
        if (Array.isArray(menu)) {
            return menu.map(item => {
                if (!item.children || !item.children.length) {
                    return (
                        <Menu.Item key={item.key || item.title}>
                            <div onClick={() => this.addPane(item)}>{item.icon && <i className={item.icon} ></i>}<span>{item.title}</span></div>
                        </Menu.Item>
                    )
                } else {
                    return (
                        <Menu.SubMenu key={item.key} title={<span>{item.icon && <i className={item.icon} ></i>}<span>{item.title}</span></span>}>
                            {this.renderMenu(item.children)}
                        </Menu.SubMenu>
                    )
                }
            })
        }
    }
    /**
     * 点击侧边栏菜单添加标签页
     */
    addPane = (item) => {
        const panes = this.props.panes.slice()
        const activeMenu = item.code
        //如果标签页不存在就添加一个
        if (!panes.find(i => i.key === activeMenu)) {
            panes.push({
                name: item.title,
                key: item.code,
                content: tabs[item.code] || item.title
            })
        }
        this.props.onChangeState({
            panes,
            activeMenu
        })
    }

    shouldComponentUpdate(nextProps, nextState){
        const list = List(this.props.accessedMenus)
        const list2 = List(nextProps.accessedMenus)
        if(list.equals(list2)){
            return false;
        }
        return true;
    }
    componentDidUpdate(){
        console.log('update')
    }
    render() { 
        const { activeMenu, theme, accessedMenus} = this.props
        if(activeMenu){
            this.addPane(activeMenu)
        }
        const list = List(this.props.accessedMenus ||[])
        const menu =list.merge(constantMenuMap)
        return (
            <div className={`my-sider ${theme}`}>
                <div className={`sider-menu-logo ${theme}`}>
                    <a href="https://ant.design/docs/react/introduce-cn" target="_blank" rel="noopener noreferrer">
                        <img src={require('../../assets/images/antd.svg')} alt="" />
                        <h1>Ant Design</h1>
                    </a>
                </div>
                <Menu theme={theme} mode="inline" selectedKeys={[activeMenu.code]} style={{ paddingTop: 16 }}>
                    {this.renderMenu(menu.toJS())}
                </Menu>
            </div >
        )
    }
}



export default MySider