import React from 'react'
import {Tree, Input} from 'antd'
const { TreeNode } = Tree;
const { Search } = Input;
const gData = [];
class Navbar extends React.Component{
    constructor(props){
      super(props)
      this.state = {
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
           
          };
      
    }
   render(){
       const { searchValue, expandedKeys, autoExpandParent } = this.state;
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
        >
          {loop(gData)}
        </Tree>
      </div>

       )
   }
}
export default Navbar