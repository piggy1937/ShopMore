import React from 'react'
import { Input, Button, Row, Col, Table } from 'antd';
import CreateElementModal from './createElementModal'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'

const store = connect(
  (state) => ({
      currentId:state.menu.currentId
   }),
  (dispatch) => bindActionCreators({}, dispatch)
)
@store
class Element extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowCreateModal: false
    }
  }
  toggleShowCreateModal = (visible) => {
    this.setState({
      isShowCreateModal: visible
    })
  }
  render() {
    const { Search } = Input;
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
        render: text => <a>{text}</a>,
      },
      {
        title: '资源编码',
        dataIndex: 'code',
        key: 'code',
        render: text => <a>{text}</a>,
      },
      {
        title: '资源类型',
        dataIndex: 'type',
        key: 'type',
        render: text => <a>{text}</a>,
      },
      {
        title: '资源名称',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: '资源地址',
        dataIndex: 'uri',
        key: 'uri',
        render: text => <a>{text}</a>,
      },
      {
        title: '资源请求类型',
        dataIndex: 'method',
        key: 'method',
        render: text => <a>{text}</a>,
      },
      {
        title: '操作',
        render: text => <a>{text}</a>,
      },



    ];
    const { isShowCreateModal } = this.state
    return (<div>
      <Row>
        <Col span={24}>
          <Search
            style={{ width: '300px' }}
            placeholder="资源名称"
            enterButton="搜索"
            onSearch={value => console.log(value)}
          />&emsp;
                    <Button type="primary" htmlType="submit" onClick={() => this.toggleShowCreateModal(true)}>
            新增
                    </Button>
        </Col>
      </Row>
      <Table columns={columns} />
      <CreateElementModal visible={isShowCreateModal} toggleVisible={this.toggleShowCreateModal} />
    </div>);
  }
}
export default Element