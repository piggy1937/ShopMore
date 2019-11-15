import React from 'react'
import { Tree, Input,Icon,Button,Tooltip} from 'antd'
import request from '@/utils/request'
import { changeRoleStatus ,fetchRole} from '@/store/actions'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import './navbar.css'
const { TreeNode } = Tree;
const { Search } = Input;
const store = connect(
  (state) => ({ formStatus: state.role.formStatus,
     formEdit: state.role.formEdit,
     roleData:state.role.roleData
  }),
  (dispatch) => bindActionCreators({ changeRoleStatus,fetchRole }, dispatch)
)

const dataList = [];
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key,title } = node;
    dataList.push({ key, title: title });
    if (node.children) {
      generateList(node.children);
    }
  }
};
const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
@store
class Navbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        type:this.props.type ,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      nodeTreeItem:null,
    };

  }
  async componentDidMount() {
    await this.props.fetchRole(this.state.type)
      console.log(this.state.type)
    generateList(this.props.roleData);
  }
  //处理树形图点击事件
  onHandleNodeSelect = (selectedKeys, obj) => {
    this.clearRightMenu();
    let id = obj.node.props.eventKey
    if(!id){
      return
     }
    if (!this.props.formEdit) {
      this.props.changeRoleStatus({
        formStatus: 'update',
        formEdit:this.props.formEdit,
        currentId:this.props.currentId
      })
    }    
    this.props.getRoleInfo(id);
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
/**新增子菜单 */
onHandleAddcChildMenu(e){
  const {id} = this.state.nodeTreeItem

  

}
onExpand = expandedKeys => {
  this.setState({
    expandedKeys,
    autoExpandParent: false,
  });
};

/**
 * 搜索框更新
 */
onSearchChange = (e) => {
  const { value } = e.target;
  const expandedKeys = dataList
    .map(item => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, this.props.roleData);
      }
      return null;
    })
    .filter((item, i, self) => item && self.indexOf(item) === i);
  this.setState({
    expandedKeys,
    searchValue: value,
    autoExpandParent: true,
  });
};

getNodeTreeMenu = ()=>{
  const {pageX,pageY} = this.state.nodeTreeItem
  return (
     <div style={{position:"absolute",top:pageY+'px',left:pageX+'px',width:'100px',marginLeft:'20px'}}>
        <Tooltip title="子菜单">
          <Button className="icon-btn" onClick={this.onHandleAddcChildMenu}>
          
            <Icon type="plus" />
          </Button>
        </Tooltip>
  </div>
    )
}


  render() {
   
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const {roleData} = this.props
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
            <TreeNode icon={<i className={item.icon}></i>} key={item.key} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode icon={item.icon} key={item.key} title={title} />;
      });
    return (
      <div >
        <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onSearchChange} />
        <Tree
          showLine={false}
          showIcon={true}
          switcherIcon={<Icon type="down" />}
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onSelect={this.onHandleNodeSelect}
          onRightClick={this.onHandleNodeRightClick}
        >
          {loop(roleData)}
        </Tree>
        {this.state.nodeTreeItem != null ? this.getNodeTreeMenu() : ""}
      </div>

    )
  }
}
export default Navbar