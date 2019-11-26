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

/**模板管理 */
@withRouter@Form.create()
class TemplateManager extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            component:'',
            items: [],
            isLoading: false,
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
        this.getTemplateInfo()
    }

    /***
     * 获取表单
     */
    getTemplateInfo = async (page = 0) => {
        const {pagination} = this.state;
        const field = this.props.form.getFieldsValue();
        this.setState({
            isLoading: true,
        })
        try {
            const res = await request({
                headers: {
                    'content-type': 'application/json',
                },
                method: 'get',
                url: '/api/admin/template/page',
                data: {
                    pageNum: page,
                    pageSize: pagination.pageSize,
                    name:field.name,
                    type:field.type
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
     * 条件查询
     */
    onSearch=()=>{
        this.getTemplateInfo()
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
     * 根据id查询表单
     * @returns {*}
     */
    handleUpdate =(id)=>{
      this.setState({
          isLoading:true
      })
        request({
            method:'get',
            url:'/api/admin/template/findById',
            data:{id}
        }).then(data=>{
            if(data.code===200){
                this.props.history.push({pathname:'/template',query:{component:data.result.formStyle}})
            }else{
                message.error(data.message)
            }
        }).catch(err=>{
            message.error(err.message)
        })
        this.setState({
            isLoading:false
        })
    }

    render() {
        const {items,isLoading} = this.state;
        const { getFieldDecorator, selectedRowKeys } = this.props.form
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
                title: '模板标识',
                dataIndex: 'code',
                key: 'code'
            },
            {
                title: '模板名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '分类',
                dataIndex: 'type',
                key: 'type',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                            <Popconfirm
                                placement="rightBottom"
                                title="此操作将永久删除, 是否继续?"
                                onConfirm={() => {

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
                            <Form.Item label="模板名称">
                                {getFieldDecorator('name')(
                                    <Input
                                        onPressEnter={this.onSearch}
                                        style={{ width: 200 }}
                                        placeholder="请输入模板名称"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="模板分类">
                                {getFieldDecorator('type')(
                                    <Input
                                        onPressEnter={this.onSearch}
                                        style={{ width: 200 }}
                                        placeholder="请输入分类"
                                    />
                                )}
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item style={{marginRight: 0, width: '100%'}} wrapperCol={{span: 24}}>
                                <div style={{textAlign: 'left'}}>
                                    <Button icon="plus" onClick={() => {
                                        this.props.history.push({pathname: '/template',state:{state:'create'}})
                                    }}>新建模板</Button>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Table
                    bordered
                    dataSource={items}
                    columns={columns}
                    pagination={false}
                    loading={isLoading}
                />
            </Card>
            <div style={{textAlign: 'right'}}>
                <Pagination defaultCurrent={1} total={this.state.pagination.total} onChange={this.onChangePage} />
            </div>
        </div>)
    }
}

export default TemplateManager