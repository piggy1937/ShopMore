
import React from 'react'
import Navbar from './navbar'
import { Card, Button,Icon, Row, Col, Input,Form,Select,Popconfirm,message} from 'antd'
import { withRouter } from 'react-router-dom'
import request from '@/utils/request'
import {connect} from "react-redux";
import { changeRoleStatus ,fetchRole} from '@/store/actions'
import { bindActionCreators } from 'redux'
const store = connect(
    (state) => ({formStatus:state.role.formStatus,
        formEdit:state.role.formEdit,
        currentId:state.role.currentId,
    }),
    (dispatch) => bindActionCreators({changeRoleStatus,fetchRole}, dispatch)
)
@withRouter @Form.create()@store
class RoleType extends React.Component {
    constructor(props){
        super(props)
        this.state= {
            type:"roleType",
            showElement: false
        }
    }

    /**重置表单 */
    restForm =()=>{
        const {resetFields,setFieldsValue}  = this.props.form
        resetFields();
        setFieldsValue({parentId:this.props.currentId})

    }



    /**
     * 检测路径编码用于更新是否存在
     */
    checkCodeUniquedForUpdate =  (rule, value, callback)=>{
        const {getFieldValue} = this.props.form
        let id = getFieldValue('id')
        request({
            headers: {
                'content-type': 'application/json',
            },
            method: 'get',
            url: '/api/admin/role/check_code',
            data: {
                code: value,
                id:id
            }
        }).then(data=>{
            console.log(data)
            const {code,message} = data
            if(code===200){
                callback();
            }else{

                if(this.props.formStatus === 'create'){
                    callback(message);
                } else{
                    callback();
                }

            }
        }).catch(err=>{
            callback(err);
        })

    }

    /**
     * 检测路径编码是否存在
     */
    checkCodeUniqued =  (rule, value, callback)=>{

        request({
            headers: {
                'content-type': 'application/json',
            },
            method: 'get',
            url: '/api/admin/role/check_code',
            data: {
                code: value
            }
        }).then(data=>{
            console.log(data)
            const {code,message} = data
            if(code===200){
                callback();
            }else{

                if(this.props.formStatus === 'create'){
                    callback(message);
                } else{
                    callback();
                }

            }
        }).catch(err=>{
            callback(err);
        })

    }
    /**
     * 检测路径编码用于更新是否存在
     */
    checkCodeUniquedForUpdate =  (rule, value, callback)=>{
        const {getFieldValue} = this.props.form
        let id = getFieldValue('id')
        request({
            headers: {
                'content-type': 'application/json',
            },
            method: 'get',
            url: '/api/admin/role/check_code',
            data: {
                code: value,
                id:id
            }
        }).then(data=>{
            const {code,message} = data
            if(code===200){
                callback();
            }else{

                if(this.props.formStatus === 'create'){
                    callback(message);
                } else{
                    callback();
                }

            }
        }).catch(err=>{
            callback(err);
        })

    }

    /**
     * 添加新角色
     */
    handleAddRole = ()=>{

        this.props.form.validateFields(async (errors, values) => {
            if (!errors) {
                const ret2= await request({
                    method:'post',
                    url: '/api/admin/role',
                    data:{
                        id:values.id,
                        name:values.name,
                        code:values.code,
                        parentId:values.parentId,
                        description:values.description,
                        roleTypeId:6
                    }
                })
                if(ret2.code === 200){
                    //刷新树
                    message.success("添加成功")
                    this.props.fetchRole("roleType")
                }else{
                    message.error(ret2.message)
                }
            }
        });
    }

    /**删除菜单项 */
    handleDeleteconfirm = ()=>{
        request({
            method:'delete',
            url:'/api/admin/role',
            data:{
                id:this.props.currentId
            }
        }).then(res=>{

            if(res.code === 200){
                message.success('删除成功');
                this.restForm()
                this.props.fetchRole("roleType")
            }else{
                message.error('删除失败');
            }

        }).catch(err=>{
            console.log(err)
        })
    }

    /**
     * 更新菜单
     */
    handleUpdateRole = ()=>{
        this.props.form.validateFields(async (errors, values) => {
            if (!errors) {
                const ret2 = await request({
                    method: 'put',
                    url: '/api/admin/role',
                    data: values
                })
                if (ret2.code === 200) {
                    message.success('修改成功')
                    this.props.fetchRole("roleType")
                }
            }
        })
    }

    /**取消 */
    handleCancle =()=>{
        this.props.changeRoleStatus({
            formStatus:'',
            formEdit:true
        })
    }
    /***
     * 获取角色信息
     */
    fetchRoleInfo= (id)=>{
        request({
            method:'get',
            url:'/api/admin/role',
            data:{id}
        }).then(res=>{
            if(res.code===200){
                const {setFieldsValue} =this.props.form
                const {id,code,name,description,parentId} = res.result
                setFieldsValue({
                    id,
                    code,
                    name,
                    parentId,
                    description
                })
                this.props.changeRoleStatus({
                    formStatus:this.props.formStatus,
                    formEdit:this.props.formEdit,
                    currentId:id
                })
                this.setState({
                    showElement:true
                })
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const {formStatus} = this.props
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 21 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        return (
            <div style={{ padding: 24 }}>
                <Row style={{marginBottom:'18px'}}>
                    <Col span={12}>
                        <div style={{ textAlign: 'left' }}>
                            <Button type="primary" icon='plus' onClick={()=>{
                                this.restForm()
                                this.props.changeRoleStatus({
                                    formStatus:'create',
                                    currentId:this.props.currentId,
                                    formEdit:false
                                })
                            }} >添加</Button>&emsp;
                            <Button type="primary" icon="edit" onClick={()=>{
                                this.props.changeRoleStatus({
                                    formStatus:'update',
                                    currentId:this.props.currentId,
                                    formEdit:false
                                })}}>编辑</Button>&emsp;
                            <Popconfirm
                                placement="rightBottom"
                                title="此操作将永久删除, 是否继续?"
                                onConfirm={this.handleDeleteconfirm}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="primary" icon="delete" >删除</Button>
                            </Popconfirm>
                        </div>
                    </Col>
                </Row>
                <Card bordered={true}>
                    <Row style={{marginTop:'10px'}}>
                        <Col span={8}>
                            <Navbar getRoleInfo={this.fetchRoleInfo} type={this.state.type}></Navbar>
                        </Col>
                        <Col span={15} offset={1}>
                            <Card bordered={true}>
                                <Form  {...formItemLayout}>
                                    <Form.Item >
                                        {getFieldDecorator('id')(
                                            <Input type='hidden'/>,
                                        )}
                                    </Form.Item>
                                    <Form.Item label="名称">
                                        {getFieldDecorator('name', {
                                            rules: [{ required: true, message: 'Please input your username!' }],
                                        })(
                                            <Input
                                                disabled={this.props.formEdit}
                                                placeholder="请输入角色名称"
                                            />,
                                        )}
                                    </Form.Item>
                                    <Form.Item label="父级节点">
                                        {getFieldDecorator('parentId', {
                                            rules: [],
                                        })(
                                            <Input
                                                disabled={this.props.formEdit}
                                                placeholder="请输入父级节点"
                                                readOnly
                                            />,
                                        )}
                                    </Form.Item>
                                    <Form.Item label="code">
                                        {getFieldDecorator('code', {
                                            rules: [ { required: true, message: 'Please input your username!' },
                                            this.props.formStatus==='create'&&{validator:this.checkCodeUniqued},
                                            this.props.formStatus === 'update'&&{validator:this.checkCodeUniquedForUpdate}
                                            ],
                                        })(
                                            <Input
                                                disabled={this.props.formEdit}
                                                placeholder="请输入角色Code"
                                            />,
                                        )}
                                    </Form.Item>
                                    <Form.Item label="描述">
                                        {getFieldDecorator('description', {
                                            rules: [],
                                        })(
                                            <Input
                                                disabled={this.props.formEdit}
                                                placeholder="请输入描述"
                                            />,
                                        )}
                                    </Form.Item>

                                    <Form.Item {...tailFormItemLayout} >
                                        <div style={{display: formStatus==='create'?'inline-block':'none'}}>
                                            <Button type="primary" htmlType="submit" onClick={this.handleAddRole}>
                                                保存
                                            </Button>&emsp;
                                            <Button type="primary"  onClick={this.handleCancle}>
                                                取消
                                            </Button>
                                        </div>
                                        <div  style={{display: formStatus==='update'?'inline-block':'none'}}>
                                            <Button type="primary" htmlType="submit" onClick={this.handleUpdateRole}>
                                                更新
                                            </Button>&emsp;
                                            <Button type="primary"  onClick={this.handleCancle}>
                                                取消
                                            </Button>
                                        </div>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}
export  default  RoleType