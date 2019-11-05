import React from 'react'
import {
    Table,
    Card,
    Form,
    Input,
    Button,
    Icon,
    Row,
    Col,
} from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import CreateModal from './CreateModal'
import request  from '@/utils/request'

const store = connect(
    (state) => ({ user: state.user })
)
@withRouter @store @Form.create()
class RoleTypeInfo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            items: [],
            isLoading: false,
            pagination: {
                total: 0,
                current: 1,  //前台分页是从1开始的，后台分页是从0开始的，所以要注意一下
                pageSize: 10,
                showQuickJumper: true
            },
            isShowInfoModal: false,
            isShowCreateModal: false,
        }
    }
    componentDidMount() {
        this.getRoleTypeInfo();
    }

    /**
     * 打开/关闭创建模态框
     */
    toggleShowCreateModal = (visible) => {
        this.setState({
            isShowCreateModal: visible
     })
     }
     openCreateModal = () => {
        this.toggleShowCreateModal(true)
    }
    onSearch=()=>{
        this.getRoleTypeInfo()
}

     /***
     * 获取角色信息
     */
     getRoleTypeInfo = async (page = 1) => {
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
                method: 'get',
                url: '/api/admin/role/page',
                data: {
                    pageNum:1,
                    pageSize:this.state.pagination.pageSize,
                }
            })
        }catch(e){
            this.setState({
                isLoading: false,
            })
            return
        }
        if (res.code!=200) {
            this.setState({
                isLoading: false,
            })
            return
        }
        this.setState({
            isLoading: false,
            items: res.result.content
        })
    }

    render() {
        const { pagination, isShowCreateModal } = this.state
        const { getFieldDecorator } = this.props.form
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
                title: '角色名称',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '角色类型',
                dataIndex: 'type',
                align: 'center'
            },{
                title: '角色描述',
                dataIndex: 'description',
                align: 'center'
            },
                {
                title: '创建日期',
                dataIndex: 'createdDate',
                align: 'center'
            },
            {
                title: '修改日期',
                dataIndex: 'modifiedDate',
                align: 'center'
            },
            {
                title: '修改人员',
                dataIndex: 'modifiedUser',
                align: 'center'
            },
            {
                render: (record) => (
                        <div style={{ textAlign: 'right' }}>
                            <Button type="primary" icon='delete'  type='danger' onClick={()=>{

                            }}>删除</Button>&emsp;
                            <Button type="primary" icon='undo' onClick={()=> {

                            }}>修改</Button>&emsp;
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
                                <Form.Item>
                                    {getFieldDecorator('username')(
                                        <Input
                                            onPressEnter={this.onSearch}
                                            style={{ width: 200 }}
                                            placeholder="角色名称"
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item style={{ marginRight: 0, width: '100%' }} wrapperCol={{ span: 48 }}>
                                    <div style={{ textAlign: 'left' }}>
                                        <Button type="primary" icon='search' onClick={this.onSearch}>搜索</Button>&emsp;
                                        <Button icon='plus' onClick={this.openCreateModal}>创建</Button>
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
                        rowSelection={this.state.rowSelection}
                        pagination={this.state.pagination}
                    />
                </Card>
                <CreateModal
                    visible={isShowCreateModal}
                    toggleVisible={this.toggleShowCreateModal}
                    onCreate={this.getRoleTypeInfo}
                   />
            </div>
        );
    }

}
export default RoleTypeInfo
