import React from 'react'
import { Tree, Input,Icon,Button,Tooltip} from 'antd'
import request from '@/utils/request'
import { changeFormStatus } from '@/store/actions'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import './navbar.css'
const { TreeNode } = Tree;
const { Search } = Input;
const store = connect(
  (state) => ({ formStatus: state.menu.formStatus, formEdit: state.menu.formEdit }),
  (dispatch) => bindActionCreators({ changeFormStatus }, dispatch)
)
@store
class Navbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      nodeTreeItem:null,
      menuData: []
    };

  }
  async componentDidMount() {
    const ret2 = await request({
      methos: 'get',
      url: '/api/admin/menu/tree',
      data: {}
    })
    if (ret2) {
      this.setState({
        menuData: [...this.state.menuData, ...ret2.result || '']
      })
    }
  }
  //处理树形图点击事件
  onHandleNodeSelect = (selectedKeys, obj) => {
    this.clearRightMenu();
    if (!this.props.formEdit) {
      this.props.changeFormStatus({
        formStatus: 'update'
      })
    }
    let id = obj.node.props.eventKey
    if(!id){
     return
    }
    this.props.getMenuInfo(id);
  }
  clearRightMenu=()=>{
    this.setState({
      nodeTreeItem: null
    });
  }
//右击显示菜单
onHandleNodeRightClick = ({event, node})=>{
    var x = event.currentTarget.offsetLeft + event.currentTarget.clientWidth;
    var y = event.currentTarget.offsetTop ;
    this.setState({
      nodeTreeItem: {
        pageX: x,
        pageY: y,
        id: node.props.eventKey,
        name: node.props.title
      }
    });

}
getNodeTreeMenu = ()=>{
  const {pageX,pageY} = this.state.nodeTreeItem
  return (
     <div style={{position:"absolute",top:pageY+'px',left:pageX+'px',width:'100px',marginLeft:'20px'}}>
        <Tooltip title="子菜单">
          <Button className="icon-btn">
          
            <Icon type="plus" />
          </Button>
        </Tooltip>
  </div>
    )
}


  render() {
    const { searchValue, expandedKeys, autoExpandParent, menuData } = this.state;
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
              <span>{item.title}</span>
            );
        if (item.children) {
          return (
            <TreeNode key={item.key} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={title} />;
      });
    return (
      <div >
        <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
        <Tree
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onSelect={this.onHandleNodeSelect}
          onRightClick={this.onHandleNodeRightClick}
        >
          {loop(menuData)}
        </Tree>
        {this.state.nodeTreeItem != null ? this.getNodeTreeMenu() : ""}
      </div>

    )
  }
}
export default Navbar