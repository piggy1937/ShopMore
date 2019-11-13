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
import CreateDrawer from "./CreateDrawer";
const { Search } = Input;
const store = connect(
    (state) => ({ user: state.user })
)


@withRouter @store @Form.create()
class UsersManager extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sex: ['男', '女'],
            items: [],
            isLoading: false,
            pagination: {
                total: 0,
                current: 1,  //前台分页是从1开始的，后台分页是从0开始的，所以要注意一下
                pageSize: 10,
                showQuickJumper: true,
                totalPages:0
            },
            visible:false
        }
    }
    componentDidMount() {
        this.getUsersInfo(0);
    }

    toggleShowCreateDrawer=(visible)=>{
        this.setState({
            visible
        })
}

    /**
     * 分页取数据
     * @param page
     * @param pageSize
     */
    onChangePage=(page,pageSize)=>{
        this.getRoleTypeInfo(page-1)
        this.setState({
            pagination:{
                current: (page-1)*pageSize
            }
        })
    }

    /**
     *根据name类型产找
     */
    onSearch=(value)=>{
        const {current}= this.state.pagination

    }

    /***
     * 获取角色信息
     */
    getUsersInfo = async (page=0,name) => {
        const {pagination} = this.state
        this.setState({
            isLoading: true,
        })
        try{
            const   res = await request({
                headers: {
                    'content-type': 'application/json',
                },
                method: 'get',
                url: '/api/admin/user/page',
                data: {
                    pageNum:page,
                    pageSize:pagination.pageSize
                }
            })
            if (res.code!=200) {
                this.setState({
                    isLoading: false,
                })
                return
            }
            const {pageSize} = res.result.pageable
            this.setState({
                isLoading: false,
                items: res.result.content,
                pagination:{
                    total:res.result.totalElements,
                    current:(page)*pageSize,
                    pageSize
                }
            })
        }catch(e){
            this.setState({
                isLoading: false,
            })
            message.error("获取角色类型异常")
            return
        }

    }

    /**删除菜单项 */
    handleDeleteconfirm = (id)=>{

    }

    /**
     * 修改按钮
     * @returns {*}
     */
    handleUpdate = (id) =>{
        this.setState({
            visible:true
        })
    }

    render() {
        const { pagination, visible,title } = this.state
        const { getFieldDecorator, selectedRowKeys } = this.props.form
        const { Option } = Select;
        const columns = [
            {
                title: '序号',
                key: 'num',
                align: 'center',
                render: (text, record, index) => {
                    let num = index + 1 +this.state.pagination.current
                    return num
                }
            },
            {
                title: '用户账号',
                dataIndex: 'username',
                align: 'center'
            },
            {
                title: '性别',
                dataIndex:'sex',
                align: 'center',
                render:(text)=>{
                    if(text===1){
                        return "男"
                    }else{
                        return"女"
                    }
                }
            },
            {
                title: '头像',
                dataIndex: 'avatar',
                align: 'center',
                render:(text)=> {
                   if(text){
                     return  <img src={text} alt="avatar" width={30} height={30} />
                   }
                }
            },{
                title: '登录IP',
                dataIndex: 'lastLoginIp',
                align: 'center'
            },
            {
                title: '最后登录日期',
                dataIndex: 'lastLoginDate',
                align: 'center'
            },
            {
                title: '是否锁定',
                dataIndex: 'isLocked',
                align: 'center',
                render:(text)=>{
                    if(text){
                        return '是'
                    }else{
                        return '否'
                    }
                },
            },
            {
                render: (record) => (
                    <div style={{ textAlign: 'left' }}>
                        <Popconfirm
                            disabled={record.isSystem}
                            placement="rightBottom"
                            title="此操作将永久删除, 是否继续?"
                            onConfirm={()=>{
                                this.handleDeleteconfirm(record.id)
                            }}
                            okText="Yes"
                            cancelText="No">
                            <Button icon="delete"  type='danger'>删除</Button>
                        </Popconfirm>&emsp;
                        <Button type="primary" icon='undo'  onClick={()=> {
                            this.handleUpdate()
                        }}>编辑</Button>
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
                                <Form.Item label="账号">
                                    {getFieldDecorator('name')(
                                        <Input
                                            onPressEnter={this.onSearch}
                                            style={{ width: 200 }}
                                            placeholder="请输入账号"
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                            <Form.Item label="性别">
                                {getFieldDecorator('sex', {
                                    initialValue: ''
                                })(
                                    <Select
                                        style={{ width: 180 }}
                                        placeholder="请选择性别"
                                    >
                                        {
                                            this.state.sex.map(item=>{
                                                return( <Option key={item} value={item}>{item}</Option>)
                                            })
                                        }
                                    </Select>,
                                )}
                            </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item style={{ marginRight: 0, width: '100%' }} wrapperCol={{ span: 24 }}>
                                    <div style={{ textAlign: 'left' }}>
                                        <Button type="primary" icon='search' onClick={this.onSearch}>搜索</Button>&emsp;
                                        <Button icon="reload" onClick={this.onReset}>重置</Button>&emsp;
                                        <Button icon="plus" onClick={this.onReset}>添加</Button>
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
                <CreateDrawer  visible={visible}
                               toggleVisible={this.toggleShowCreateDrawer}
                />
            </div>
        );
    }
}
export default UsersManager