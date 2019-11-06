import React from 'react'
import { Menu, Icon } from 'antd'
import { tabs, constantMenuMap } from '../tabs'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchMenu } from '@/store/actions'
const store = connect(
    (state) => ({ asyncMenuData:state.menu.menuData }),
    (dispatch) => bindActionCreators({ fetchMenu}, dispatch)
)
@store
class MySider extends React.Component {
    /**
     * 生成侧边栏菜单
     */
    constructor(props){
        super(props)
        this.state={
            menus:[]
        }
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
    
    
    async componentDidMount(){
        await this.props.fetchMenu()//获取所有的菜单
        let menu = this.props.asyncMenuData.concat(constantMenuMap)
        this.setState({
            menus:menu
        })
        console.log(this.props.asyncMenuData)
    }
    render() {
        const { activeMenu, theme } = this.props
        return (
            <div className={`my-sider ${theme}`}>
                <div className={`sider-menu-logo ${theme}`}>
                    <a href="https://ant.design/docs/react/introduce-cn" target="_blank" rel="noopener noreferrer">
                        <img src={require('../../assets/images/antd.svg')} alt="" />
                        <h1>Ant Design</h1>
                    </a>
                </div>
                <Menu theme={theme} mode="inline" selectedKeys={[activeMenu]} style={{ paddingTop: 16 }}>
                    {this.renderMenu(this.state.menus)}
                </Menu>
            </div >
        )
    }
}



export default MySider