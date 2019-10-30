import React from 'react'
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
    Checkbox
} from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import CreateModal from './CreateModal'
import request  from '@/utils/request'

const store = connect(
    (state) => ({ user: state.user })
)
@withRouter @store @Form.create()
class ScheduleInfo extends React.Component {

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
        this.getScheduleInfo();
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

     /***
     * 获取定时信息
     */
    getScheduleInfo = async (page = 1) => {
        const { pagination } = this.state

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
                url: '/api/job/page',
                data: {
                    pageNum:1,
                    pageSize:20
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


    /**
     * 删除函数
     */
    onHandleDelete = (props) => {
        Modal.confirm({
            title: '请问确定要删除吗？',
            maskClosable: true,
            onOk: async () => {
                let res
                try{
                    res = await request({
                        headers: {
                            'content-type': 'application/json',
                        },
                        method: 'delete',
                        url: '/api/job',
                        data: {
                            jobClassName: props.jobClassName,
                            jobGroupName: props.jobGroup
                        }
                    })
                }catch(e){
                    this.setState({
                        isLoading: false,
                    })
                    return
                }
                 if(res.code!=200){
                     message.error(res.messages)
                     this.setState({
                         isLoading: false,
                     })
                     return
                 }else{
                     message.success("删除成功")
                     this.getScheduleInfo()
                     this.setState({
                         isLoading: true,
                     })
                 }


            },

        })
    }
    /**
     * 暂停
     */
    onHandlePause = async (props) => {
        if(props.triggerState=="暂停"){
            message.warning("已经是暂停状态")
            return
        }
                let res
                try{
                    res = await request({
                        headers: {
                            'content-type': 'application/json',
                        },
                        method: 'post',
                        url: 'api/job/pause',
                        data: {
                            jobClassName: props.jobClassName,
                            jobGroupName: props.jobGroup
                        }
                    })
                }catch(e){
                    this.setState({
                        isLoading: false,
                    })
                    return
                }

        if(res.code!=200){
            message.error(res.message)
            this.setState({
                isLoading: false,
            })
            return
        }else{
            message.success(res.message)
            this.getScheduleInfo()
            this.setState({
                isLoading: true,
            })
        }
    }

    /**
     * 恢复
     */
    onHandleResume = async (props) => {
        if(props.triggerState=="启动"){
            message.warning("已经是启动状态")
            return
        }
        let res
        try{
            res = await request({
                headers: {
                    'content-type': 'application/json',
                },
                method: 'post',
                url: 'api/job/resume',
                data: {
                    jobClassName: props.jobClassName,
                    jobGroupName: props.jobGroup,
                }
            })
        }catch(e){
            this.setState({
                isLoading: false,
            })
            return
        }

        if(res.code!=200){
            message.error(res.message)
            this.setState({
                isLoading: false,
            })
            return
        }else{
            message.success(res.message)
            this.getScheduleInfo()
            this.setState({
                isLoading: true,
            })
        }
    }


    render() {
        const { getFieldDecorator, selectedRowKeys } = this.props.form
        const { collections, isShowCreateModal } = this.state
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
                title: '定时名称',
                dataIndex: 'jobName',
                align: 'center'
            },
            {
                title: '定时组名',
                dataIndex: 'jobGroup',
                align: 'center'
            },{
                title: '类名',
                dataIndex: 'jobClassName',
                align: 'center'
            },
                {
                title: 'cron表达式',
                dataIndex: 'cronExpression',
                align: 'center'
            },
            {
                title: '状态',
                dataIndex: 'triggerState',
                align: 'center'
            },
            {
                render: (record) => (
                        <div style={{ textAlign: 'right' }}>
                            <Button type="primary" icon='delete'  type='danger' onClick={()=>{
                                this.onHandleDelete(record)
                            }}>删除</Button>&emsp;
                            <Button type="primary" icon='undo' onClick={()=> {
                                this.onHandleResume(record)
                            }}>恢复</Button>&emsp;
                            <Button type="primary" icon='pause' onClick={()=>
                                this.onHandlePause(record)
                             }>暂停</Button>
                        </div>
                ),
            }
        ]
        return (
            <div style={{ padding: 24 }}>
                <Card bordered={false}>
                    <Form layout='inline' style={{ marginBottom: 16 }}>
                        <Row>
                            <Col span={10}>
                                <Form.Item style={{ marginRight: 0, width: '100%' }} wrapperCol={{ span: 48 }}>
                                    <div style={{ textAlign: 'left' }}>
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
                    onCreate={this.getScheduleInfo}
                   />
            </div>
        );
    }

}
export default ScheduleInfo
