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
    Tag,
    Modal,
    Popconfirm,
    notification,
    Pagination, Select
} from 'antd'
import request from '@/utils/request'
import {withRouter} from 'react-router-dom'
import CreateFormModal from './createFormModal'

/**表单设计 */
@withRouter
class DynamicformDesigner extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            component:'',
            items: [],
            isLoading: false,
            isShowCreateModal: false, //是否展示对话框
            pagination: {
                total: 0,
                current: 1,
                pageSize: 10,
                showQuickJumper: true,
                totalPages: 0
            },
        }
    }

    componentDidMount() {
        this.getDesignFormInfo()
    }
    /**切换对话框显示状态 */
    toggleShowCreateModal = (visible) => {
        this.setState({
          isShowCreateModal: visible
        })
      }
    /***
     * 获取表单
     */
    getDesignFormInfo = async (page = 0, name) => {
        const {pagination} = this.state;
        this.setState({
            isLoading: true,
        })

        try {
            const res = await request({
                headers: {
                    'content-type': 'application/json',
                },
                method: 'get',
                url: '/api/admin/dynamic/form/page',
                data: {
                    pageNum: page,
                    pageSize: pagination.pageSize,
                    name
                }
            })
            if (res.code != 200) {
                this.setState({
                    isLoading: false,
                })
                return
            }
            const {content, totalElements, pageable} = res.result
            this.setState({
                isLoading: false,
                items: content,
                pagination: {
                    total: totalElements,
                    current: page * pageable.pageSize,
                    pageSize: pageable.pageSize
                }
            })
        } catch (e) {
            this.setState({
                isLoading: false,
            })
            message.error("获取表单异常")
            return
        }
    }

    /**
     * 改变页码
     * @param page
     * @param pageSize
     */
    onChangePage = (page, pageSize) => {
        this.getDesignFormInfo(page-1)
        this.setState({
            pagination: {
                current: (page - 1) * pageSize
            }
        })
    }
    /**
     * 发布表单
     */
    handleDeploy = async (id)=>{
      const ret = await request({
          method:'put',
          url:`/api/admin/dynamic/form/${id}/deploy`
      })
    }

   /**删除表单 */
   handleDelete = async (id)=>{
    const ret = await request({
        method:'delete',
        url:`/api/admin/dynamic/form/${id}/delete`
    })
    if(ret.code === 200){
        this.getDesignFormInfo()
    }
  }

    /**
     * 根据id查询表单
     * @returns {*}
     */
    handleUpdate =(id)=>{
      this.onFormInfoRef.initForm(id)
    }

    /**父子组件调用 */
    onFormInfoRef = (ref) => {
        this.onFormInfoRef = ref
    }

    render() {
        const {items,isLoading,isShowCreateModal} = this.state
        const columns = [
            {
                title: '序号',
                key: 'num',
                align: 'center',
                render: (text, record, index) => {
                    let num = index + 1 + this.state.pagination.current
                    return num
                }
            },
            {
                title: '数据库表名',
                dataIndex: 'databaseTableName',
                key: 'databaseTableName'
            },
            {
                title: '表单名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '创建人',
                dataIndex: 'creater',
                key: 'creater',
            },
            {
                title: '创建日期',
                dataIndex: 'createdDate',
                key: 'createdDate',
            },
            {
                title: '修改日期',
                dataIndex: 'modifiedDate',
                key: 'modifiedDate',
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <Button type="primary" icon='edit' onClick={() => {
                            this.handleDeploy(record.id)
                        }}>发布</Button>&emsp;
                            <Popconfirm
                                placement="rightBottom"
                                title="此操作将永久删除, 是否继续?"
                                onConfirm={() => {
                                    this.handleDelete(record.id)
                                }}
                                okText="Yes"
                                cancelText="No">
                                <Button icon="delete" type='danger'>删除</Button>
                            </Popconfirm>&emsp;
                        <Button type="primary" icon='edit' onClick={() => {
                            this.handleUpdate(record.id)
                        }} loading={this.state.isLoading}>编辑</Button>
                </span>
                ),
            },
        ];
        return (<div>
            <Card bordered={false}>
                <Form layout='inline' style={{marginBottom: 16}}>
                    <Row>
                        <Col span={6}>
                            <Form.Item style={{marginRight: 0, width: '100%'}} wrapperCol={{span: 24}}>
                                <div style={{textAlign: 'left'}}>
                                    <Button icon="plus" onClick={() => {
                                      this.toggleShowCreateModal(true)
                                    }}>新建表单</Button>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Table
                    dataSource={items}
                    columns={columns}
                    pagination={false}
                    loading={isLoading}
                />
            </Card>
            <div style={{textAlign: 'right'}}>
                <Pagination defaultCurrent={1} total={this.state.pagination.total} onChange={this.onChangePage} />
            </div>
            <CreateFormModal visible={isShowCreateModal} toggleVisible={this.toggleShowCreateModal}  onRef={this.onFormInfoRef}/>
        </div>)
    }
}

export default DynamicformDesigner