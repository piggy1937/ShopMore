import React from 'react'
import { Tree, Input } from 'antd';
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
const { TreeNode } = Tree;
const { Search } = Input;
const store = connect(
    (state) => ({ 
        treeData:state.menu.menuData }),
    (dispatch) => bindActionCreators({ }, dispatch)
  )
  @store  
class NavBar extends React.Component {
    constructor(props){
        super(props)
        this.state={
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
            
        }
    }
    handleExpand = expandedKeys => {
        this.setState({
          expandedKeys,
          autoExpandParent: false,
        });
      };
    handleChange=(value)=>{
        this.setState({ value });
    }
   
    render() {
        const {treeData} = this.props
        const { searchValue, expandedKeys, autoExpandParent ,checkedKeys} = this.state;
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
            <div>
            <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.handleChange} />
            <Tree
              checkable
              onExpand={this.handleExpand}
              expandedKeys={expandedKeys}
              checkedKeys={this.props.checkedKeys}
              onCheck={(checkedKeys)=>this.props.handleTreeCheck(checkedKeys)}
              onSelect = {(value, label, extra)=>{
                  this.props.handleNodeChange(value, label, extra)
                }}
              autoExpandParent={autoExpandParent}
            >
              {loop(treeData)}
            </Tree>
          </div>
           
        
        );
    }

}
export default NavBar