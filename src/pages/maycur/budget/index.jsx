import React from 'react'
import { Table, Card, Form, Input, Button, DatePicker, message, Icon, Row, Col, Divider, Modal, Popconfirm, notification,TreeSelect} from 'antd'
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
            isShowCreateModal: false,
            value: undefined,
            treeData:[],
            depTreeData:[]

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
                deptBizCodes: [...fields.department || '']
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
   
  
   async componentDidMount (){
       

        let p1 = new Promise(async (resolve, reject) => {
            try{
                const ret = await request({
                    method:'get',
                    url:'/api/admin/subject',
                    data:{}
                })
                resolve(ret)
            }catch(e){
                reject(e)
            }
           
          })
          
          let p2 = new Promise(async (resolve, reject) => {      
            try{
                const ret = await request({
                    method:'get',
                    url:'/api/admin/subcompany',
                    data:{}
                })
                resolve(ret)
            }catch(e){
                reject(e)
            }

          })
         const ret= await Promise.all([p1, p2])
        if(ret){
            this.setState({
                treeData:ret[0].result,
                depTreeData:ret[1].result
            })
        }
    }
    /***
     * 加载部门节点
     */
    onLoadDepData = async (treeNode)=>{
        const { id } = treeNode.props;
        const ret = await request({
            method:'get',
            url:'/api/admin/department',
            data:{cid:id}
        })
        let {depTreeData} = this.state
        if(ret.success){
            this.setState({
                depTreeData:[...depTreeData,...ret.result]
              });
        }
        
    }



    render() {
        const { getFieldDecorator, selectedRowKeys } = this.props.form
        const { pagination ,treeData,depTreeData} = this.state
        const { SHOW_PARENT } = TreeSelect;
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
                                        <TreeSelect
                                        showSearch
                                        treeDataSimpleMode
                                        treeNodeFilterProp="title"
                                        style={{ width: 200 }}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        placeholder="请选择科目"
                                        treeData={treeData}
                                        onSelect={(value,node,extra)=>{
                                            const { setFieldsValue } = this.props.form
                                            setFieldsValue({'subject':value})
                                            this.onSearch()
                                           }}
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
                                <Form.Item label="部门">
                                    {getFieldDecorator('department')(
                                       <TreeSelect
                                       showSearch
                                       treeDataSimpleMode
                                       treeNodeFilterProp="title"
                                       style={{ width: 200 }}
                                       dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                       placeholder="请选择部門"
                                       treeData={depTreeData}
                                       treeCheckable={true}
                                       showCheckedStrategy={SHOW_PARENT}
                                       loadData={this.onLoadDepData}
                                       onSelect={(value,node,extra)=>{
                                        const { setFieldsValue } = this.props.form
                                        setFieldsValue({'department':{...value}})
                                        this.onSearch()
                                       }}
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