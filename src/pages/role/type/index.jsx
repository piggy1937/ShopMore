import React from 'react'
import {
    Table,
    Card,
    Form,
    Input,
    Button,
    Pagination,
    Row,
    Col, message, Popconfirm,
} from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import CreateModal from './CreateModal'
import request  from '@/utils/request'
const { Search } = Input;
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
                showQuickJumper: true,
                totalPages:0
            },
            modal:{
                title:'',
                isShowInfoModal: false,
                isShowCreateModal: false,
            }
        }
    }
    componentWillMount() {
        this.getRoleTypeInfo(0);
    }

    /**
     * 打开/关闭创建模态框
     */
    toggleShowCreateModal = (visible,title) => {
        this.setState({
            isShowCreateModal: visible,
            title:title
     })
     }
     openCreateModal = (title) => {
        this.toggleShowCreateModal(true,title)
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
        this.getRoleTypeInfo(current,value);
    }

    /***
     * 获取角色信息
     */
     getRoleTypeInfo = async (page=0,name) => {
         const fields = this.props.form.getFieldsValue()
        this.setState({
            isLoading: true,
        })
       
        const {current}= this.state.pagination
        try{
         const   res = await request({
                headers: {
                    'content-type': 'application/json',
                },
                method: 'get',
                url: '/api/admin/role/type/page',
                data: {
                    pageNum:page,
                    pageSize:this.state.pagination.pageSize,
                    name
                }
            })
            const {totalElements ,pageable:{pageSize} } = res.result.pageable
            if (res.code!=200) {
                this.setState({
                    isLoading: false,
                })
                return
            }
            this.setState({
                isLoading: false,
                items: res.result.content,
                pagination:{
                    total:totalElements,
                    current:(page)*pageSize,
                    pageSize:pageSize
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
        request({
            method:'delete',
            url:'/api/admin/role/type',
            data:{
                id:id
            }
        }).then(res=>{
            if(res.code === 200){
                message.success('删除成功');
                this.getRoleTypeInfo(0);
            }else{
                message.error('删除失败');
            }

        }).catch(err=>{
           message.error(err)
        })
    }

    /**
     * 修改按钮
     * @returns {*}
     */
    handleUpdate = (id) =>{
        request({
            method:'get',
            url:'/api/admin/role/type',
            data:{id}
        }).then(data=>{
            if(data.code===200){
                this.elementRef.initForm(data.result);
            }else if(data.code === 100){
                message.error('非法请求参数')
            }else{
                message.error(data.mesage)
            }
        }).catch(err=>{
            if(err&&!err.success){
              message.error(err.message)
            }else{
                console.log(err)
            }})
    }
    /**父子组件调用 */
    onElementRef = (ref) => {
        this.elementRef = ref
    }

    render() {
        const { pagination, isShowCreateModal,title } = this.state
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
                title: '编码',
                dataIndex: 'code',
                align: 'center'
            },
            {
                title: '类型名称',
                dataIndex: 'name',
                align: 'center'
            },{
                title: '描述',
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
                title: '是否内置',
                dataIndex: 'isSystem',
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
                                <Button icon="delete"  type='danger' disabled={record.isSystem}>删除</Button>
                            </Popconfirm>&emsp;
                            <Button type="primary" icon='undo' disabled={record.isSystem} onClick={()=> {
                                this.handleUpdate(record.id,"修改角色")
                            }}>修改</Button>
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
                                         <Search
                                            placeholder="input search text"
                                            onSearch={this.onSearch}
                                            style={{ width: 200 }}
                                        />&emsp;
                                        <Button icon='plus' onClick={()=>{
                                            this.openCreateModal("创建角色")
                                        }}>创建</Button>
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
                <CreateModal
                    visible={isShowCreateModal}
                    toggleVisible={this.toggleShowCreateModal}
                    onCreate={this.getRoleTypeInfo}
                    onRef={this.onElementRef}
                    title={title}
                   />
            </div>
        );
    }
}
export default RoleTypeInfo
