import React  from 'react';
import { Drawer, Button,Row,Col,Table ,Card,message} from 'antd';
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import request from '@/utils/request'
import NavBar from './navbar'
import {fetchElement} from '@/store/actions'
const store = connect(
  (state) => ({
    roleId:state.role.currentId,
   }),
  (dispatch) => bindActionCreators({fetchElement}, dispatch)
)
@store
class CreateDraw extends React.Component{
  constructor(props){
    super(props)
    this.state={
      elementData:[],
      treeCheckedKeys: [],//菜单树选中的jiedian
      tableCheckedKeys:[]
    }
  }
    /**取消 */
    handleClose = () => {
        this.props.toggleVisible(false)
    }
    /**提交 */
    handleSubmit=()=>{
      const {treeCheckedKeys,tableCheckedKeys} = this.state
     request({
       method:'post',
       url:'/api/admin/permission',
       data:{
         roleId:this.props.roleId,
         menuIds:treeCheckedKeys,
         elementIds:tableCheckedKeys
       }
     })
        


      message.success('操作成功')
    }
    /**处理树节点选中 */
    handleTreeCheck=(treeCheckedKeys) => {
      this.setState({ treeCheckedKeys });
    };
    handleNodeChange=async (value, label, extra)=>{
      try{
      const res = await request({
        methos: 'get',
        url: '/api/admin/element/list',
        data: {
          menuId:value[0]
        }
      })
      if(res.code===200){
      const {content} =res.result 
      this.setState({
        elementData:content
      })


      }
    }catch(e){
      message.error(e)
    }

     console.log('132123',value)
    }
    render() {
      const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.setState({
            tableCheckedKeys:selectedRowKeys
          })
        },
        getCheckboxProps: record => ({
          disabled: record.name === 'Disabled User', // Column configuration not to be checked
          name: record.name,
        }),
      };
        const { visible , title } = this.props
        const {elementData} = this.state
        const columns = [
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
        ];
        return (
          <div>
        
            <Drawer
              title={title}
              placement="right"
              closable={false}
              onClose={this.handleClose}
              width={'60%'}
              visible={visible}
            >
             <div>
                 
             
             <Row>
                <Col span={8}>

                <NavBar checkedKeys={this.state.treeCheckedKeys} handleNodeChange={this.handleNodeChange} handleTreeCheck={this.handleTreeCheck}></NavBar>

                </Col>
                <Col span={16} >
                  <Card >
                   <Table   rowSelection={rowSelection}  rowKey="id" columns={columns} dataSource={elementData} />
                   </Card>
                </Col>
            </Row>             
             
             
             
             
             </div> 



            <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={this.handleClose} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={this.handleSubmit} type="primary">
              确认
            </Button>
          </div>
            </Drawer>
          </div>
        );
      }
}


export default CreateDraw;