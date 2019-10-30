import React from 'react'
import { Table, Card, Form, Input, Button, DatePicker, message, Icon, Row, Col, Divider, Modal, Popconfirm, notification } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import request  from '@/utils/request'
const store = connect(
    (state) => ({ user: state.user })
)
@withRouter @store @Form.create()
class BudgetInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            items: [],    //用户列表
            isLoading: false,//获取用户loading
            pagination: {
                total: 0,
                current: 1,  //前台分页是从1开始的，后台分页是从0开始的，所以要注意一下
                pageSize: 10,
                showQuickJumper: true
            },
            isShowInfoModal: false,
            userInfo: {},        //当前行的user信息
            selectedRowKeys: [],   //选择中的行keys
            isShowCreateModal: false

        }
    }
    /***
     * 获取预算信息
     */
    getBudgetInfo = async (page = 1) => {
        const { pagination } = this.state
        const fields = this.props.form.getFieldsValue()
        this.setState({
            isLoading: true,
        })
        let res
        try{

         res = await request({
            headers: {
                'content-type': 'application/json',
            },
            method: 'post',
            url: '/api/maycur/search/budget',
            data: {
                // current: page - 1,
                budgetExecDate: fields.execDate? fields.execDate.format("YYYY-MM-DD") : '',   //koa会把参数转换为字符串，undefined也会
                budgetAccountBizCode: fields.subject || '',
                deptBizCodes: [fields.department || '']
            }
        })
    }catch(e){
        this.setState({
            isLoading: false,
        })
        return
    }
        
        
        


        if (!res.isSuccess) {
            this.setState({
                isLoading: false,
            })
            return
        }
        this.setState({
            isLoading: false,
            items: res.budgetExecEntries
        })
    }
    /**
     * 搜索函数
     */
    onSearch = () => {
        this.getBudgetInfo();
    }
    render() {
        const { getFieldDecorator, selectedRowKeys } = this.props.form
        const { pagination } = this.state
        const columns = [
            {
                title: '序号',
                key: 'num',
                align: 'center',
                render: (text, record, index) => {
                    let num = (pagination.current - 1) * 10 + index + 1
                    if (num < 10) {
                        num = '0' + num
                    }
                    return num
                }
            },
            {
                title: '名称',
                dataIndex: 'budgetName',
                align: 'center'
            },
            {
                title: '币种',
                dataIndex: 'currency',
                align: 'center',
                render: (text) => {
                    if(text=== 'CNY'){
                        return '人民币'
                    }
                    return '其他'
                
                },
            },{
                title: '总预算',
                dataIndex: 'totalAmount',
                align: 'center'
            },
            {
                title: '冻结预算',
                dataIndex: 'freezedAmount',
                align: 'center'
            },
            {
                title: '已使用预算',
                dataIndex: 'usedAmount',
                align: 'center'
            },
            {
                title: '剩余预算',
                dataIndex: 'leftAmount',
                align: 'center'
            }

        ]
        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys) => this.setState({ selectedRowKeys }),
            getCheckboxProps: (record) => ({
                disabled: record.id === this.props.user.id
            })
        }
        return (
            <div style={{ padding: 24 }}>
                <Card bordered={false}>
                    <Form layout='inline' style={{ marginBottom: 16 }}>
                        <Row>
                            <Col span={6}>
                                <Form.Item label="日期">
                                    {getFieldDecorator('execDate')(
                                        <DatePicker style={{ width: 120 }} showTime />

                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="科目">
                                    {getFieldDecorator('subject')(
                                        <Input
                                            onPressEnter={this.onSearch}
                                            style={{ width: 200 }}
                                            placeholder="科目"
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="员工">
                                    {getFieldDecorator('employ')(
                                        <Input
                                            onPressEnter={this.onSearch}
                                            style={{ width: 200 }}
                                            placeholder="员工"
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item style={{ marginRight: 0, width: '100%' }} wrapperCol={{ span: 24 }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <Button type="primary" icon='search' onClick={this.onSearch}>搜索</Button>&emsp;
                                        <Button icon="reload" onClick={this.onReset}>重置</Button>
                                    </div>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item label="部门1">
                                    {getFieldDecorator('department')(
                                        <Input
                                            onPressEnter={this.onSearch}
                                            style={{ width: 200 }}
                                            placeholder="部门"
                                        />
                                    )}
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
                        rowSelection={this.state.rowSelection}
                        pagination={this.state.pagination}
                    />
                </Card>


            </div>



        );
    }
}
export default BudgetInfo