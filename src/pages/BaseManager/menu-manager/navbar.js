import React from 'react'
import { Tree, Input } from 'antd'
import request from '@/utils/request'
const { TreeNode } = Tree;
const { Search } = Input;

class Navbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
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
  render() {
    const { searchValue, expandedKeys, autoExpandParent,menuData } = this.state;
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
          {loop(menuData)}
        </Tree>
      </div>

    )
  }
}
export default Navbar