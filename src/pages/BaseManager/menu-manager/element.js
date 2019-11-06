import React from 'react'
import { Input, Button, Row, Col, Table,Divider, message } from 'antd';
import CreateElementModal from './createElementModal'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import request  from '@/utils/request'
import { fetchElement} from '@/store/actions'
const store = connect(
  (state) => ({
      key:'',
      currentId:state.menu.currentId,
      elementData:state.element.content,
      pageIndex:state.element.pageIndex
   }),
  (dispatch) => bindActionCreators({fetchElement}, dispatch)
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
  /**搜索 */
  handleSerach=(value)=>{
    this.props.fetchElement({
      name:value,
      menuId:this.props.currentId,
  });
  }
 /**修改 */
 handleUpdate=(id)=>{
  request({
    method:'get',
    url:'/api/admin/element',
    data:{id}
  }).then(data=>{
    if(data.code===200){
      this.elementRef.initForm(data.result);
    }else if(data.code === 100){
      message.error('非法请求参数')
    }else{
      message.error(data.mesage)
    }
  })
  .catch(err=>{
    console.log('123213213',err)
  })

 }
 /**删除 */
 handleDelete=(id)=>{
   
 }
 /**父子组件调用 */
 onElementRef = (ref) => {
  this.elementRef = ref
}
  render() {
    const { Search } = Input;
    const columns = [
      {
        title: '序号',
        key: 'num',
        align: 'center',
        render: (text, record, index) => {
            let num = index + 1 +this.props.pageIndex
            return num
        }
      },
      {
        title: '资源编码',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '资源类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '资源名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '资源地址',
        dataIndex: 'uri',
        key: 'uri',
      },
      {
        title: '资源请求类型',
        dataIndex: 'method',
        key: 'method',
      },
      {
        title: '操作',
        width:'115px',
        render: (text, record) => (
          <span>
            <Button type="link" style={{padding:0}} onClick={()=>{
              console.log(record)
              this.handleUpdate(record.id)
            }}>修改</Button>
            <Divider type="vertical" />
            <Button type="link" style={{padding:0}} onClick={()=>{
              this.handleDelete(record.id)
            }}>删除</Button>
          </span>
        ),
      }



    ];
    const { isShowCreateModal } = this.state
    return (<div>
      <Row>
        <Col span={24}>
          <Search
            style={{ width: '300px' }}
            placeholder="资源名称"
            enterButton="搜索"
            onSearch={this.handleSerach}
          />&emsp;
                    <Button type="primary" htmlType="submit" onClick={() => this.toggleShowCreateModal(true)}>
            新增
                    </Button>
        </Col>
      </Row>
      <Table rowKey="code" columns={columns} dataSource={this.props.elementData} />
      <CreateElementModal onRef={this.onElementRef} visible={isShowCreateModal} toggleVisible={this.toggleShowCreateModal} />
    </div>);
  }
}
export default Element