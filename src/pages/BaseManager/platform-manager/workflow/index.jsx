import React, { Component } from 'react';
import {
    Table,
    Card,
    Form,
    Input,
    Button,
    DatePicker,
    message,
    Icon,
    Row,
    Col,
    Divider,
    Modal,
    Popconfirm,
    notification,
    Pagination, Select
} from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import request  from '@/utils/request'
import { WorkflowDesignProvider,WorkflowDesignConsumer} from './WorkflowDesignProvider'
import CreateEditeModal from './createEditeModal'
import CreateSelUserModal from './createSelUserModal'
const { Search } = Input;
@withRouter @Form.create()
class FlowManager extends Component {
   constructor(props){
       super(props)
       this.state={
        pagination:{},
         visible:false,
         title:'',
         pageNumber:0,
         pageSize:10,
         items:[]
       }
    
   }
  async componentDidMount(){
      const {pageNumber,pageSize} = this.state
        const ret = await request({
            method:'get',
            url:'/api/admin/workflow/process/definition/page',
            data:{
                pageNumber,pageSize
            }
        })
        if(ret.code === 200){
            this.setState({
                items:ret.result.content
            })
        }else{
            console.log(ret)
        }
   }

 /**删除表单 */
 handleDelete = async (id)=>{
    const ret = await request({
        method:'delete',
        url:`/api/admin/workflow/process/definition/deployment/${id}`
    })
    if(ret.code === 200){
      console.log('aaaaaaaaaaaaaaaaaaaa')
    }
  }

    render() {
        const { pagination, visible,title } = this.state
        const { getFieldDecorator, selectedRowKeys } = this.props.form
        const { Option } = Select;
        const columns = [
            {
                title: 'ID',
                key: 'id',
                dataIndex: 'id',
            },
            {
                title: '名称',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: 'Key',
                dataIndex: 'key',
            },
            {
                title: '说明',
                dataIndex: 'lastLoginDate',
                align: 'center'
            },
            
            {
                title: '操作',
                render: (record) => (
                    <div style={{ textAlign: 'left' }}>
                        <Popconfirm
                            placement="rightBottom"
                            title="此操作将启动流程, 是否继续?"
                            onConfirm={()=>{
                            }}
                            okText="Yes"
                            cancelText="No">
                            <Button icon="delete"  type='danger'>启动</Button>
                        </Popconfirm>&emsp;
                        <WorkflowDesignConsumer>
                                {
                                    ({handleToggle}) => (
                                        <Button type="primary" icon='edit' onClick={() => {
                                            handleToggle(record['id'])
                                        }} >编辑</Button>
                                    )
                                }
                            </WorkflowDesignConsumer>&emsp;
                         <Popconfirm
                            placement="rightBottom"
                            title="此操作将永久删除, 是否继续?"
                            onConfirm={()=>{
                                this.handleDelete(record.deploymentId)
                            }}
                            okText="Yes"
                            cancelText="No">
                            <Button icon="delete"  type='danger'>删除</Button>
                        </Popconfirm>
                    </div>
                ),
            }
        ]
        return (
            <WorkflowDesignProvider>
            <div style={{ padding: 24 }}>
                <Card bordered={false}>
                    <Form layout='inline' style={{ marginBottom: 16 }}>
                        <Row>
                            <Col span={6}>
                                <Form.Item label="名称">
                                    {getFieldDecorator('username')(
                                        <Input
                                            onPressEnter={this.onSearch}
                                            style={{ width: 200 }}
                                            placeholder="请输入名称"
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                           
                            <Col span={6}>
                                <Form.Item style={{ marginRight: 0, width: '100%' }} wrapperCol={{ span: 24 }}>
                                    <div style={{ textAlign: 'left' }}>
                                        <Button type="primary" icon='search' onClick={this.onSearch}>搜索</Button>&emsp;
                                    </div>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <Table
                        bordered
                        rowKey='id'
                        columns={columns}
                        dataSource={this.state.items}
                        loading={this.state.isLoading}
                        pagination={false}
                    /><br/>
                    <div style={{textAlign: 'right'}}>
                        <Pagination defaultCurrent={1} total={this.state.pagination.total} onChange={this.onChangePage} />
                    </div>
                    <CreateEditeModal>
                       <CreateSelUserModal></CreateSelUserModal>
                    </CreateEditeModal>
                    
                </Card>
            </div>
            </WorkflowDesignProvider>
        );
    }
}
export default FlowManager