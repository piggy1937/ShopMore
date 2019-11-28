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
import {bindActionCreators} from "redux";
const { Search } = Input;

@withRouter @Form.create()
class FlowManager extends Component {
   constructor(props){
       super(props)
       this.state={
        pagination:{},
         visible:false,
         title:'',
       }
   }
    render() {
        const { pagination, visible,title } = this.state
        const { getFieldDecorator, selectedRowKeys } = this.props.form
        const { Option } = Select;
        const columns = [
            {
                title: 'ID',
                key: 'num',
                align: 'center',
                render: (text, record, index) => {
                    let num = index + 1 +this.state.pagination.current
                    return num
                }
            },
            {
                title: '名称',
                dataIndex: 'username',
                align: 'center'
            },
            {
                title: 'Key',
                dataIndex: 'avatar',
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
                            disabled={record.username==='admin'}
                            placement="rightBottom"
                            title="此操作将永久删除, 是否继续?"
                            onConfirm={()=>{
                            }}
                            okText="Yes"
                            cancelText="No">
                            <Button icon="delete"  type='danger'>删除</Button>
                        </Popconfirm>&emsp;
                        <Button type="primary" icon='undo'  onClick={()=> {
                        
                        }}>编辑</Button>&emsp;
                    </div>
                ),
            }
        ]
        return (
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
                </Card>
            </div>
        );
    }
}
export default FlowManager