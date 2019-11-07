import React, { Component } from 'react';
import { Modal, Form, Input, message } from 'antd';
import request  from '@/utils/request';
import { fetchRoleType} from '@/store/actions'
import {connect} from "react-redux";
import debounce from 'lodash/debounce';
import {bindActionCreators} from "redux";
const store = connect(
    (state) => ({ user: state.user, websocket: state.websocket })
)
@store
@Form.create()
class CreateModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogStatus: '',
            currentId:''
        }
        this.checkCodeUniqued = debounce(this.checkCodeUniqued, 500);
    }
    onCancel = () => {
        this.props.form.resetFields()
        this.props.toggleVisible(false)
    }
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                if(this.state.dialogStatus==='update'){
                    this.handleUpdateElement(values);
                }else{
                    this.handleAddElement(values)
                }
            }
        })
    }

    /**
     * 初始化数据
     */
    initForm=(data)=>{
        const {setFieldsValue} = this.props.form
        const {id,code,name,description} = data
        setFieldsValue({
            code,name,description
        })
        this.props.toggleVisible(true)
        this.setState({
            dialogStatus:'update',
            currentId:id
        })
    }


    /**
     * 检查code 是否存在
     */
    checkCodeUniqued =  (rule, value, callback)=>{
        request({
            headers: {
                'content-type': 'application/json',
            },
            method: 'get',
            url: '/api/admin/role_type/check_code',
            data: {
                code: value
            }
        }).then(data=>{
            const {code,message} = data
            if(code===200){
                callback();
            }else{
                callback(message);
            }
        }).catch(err=>{
            callback(err);
        })

    }
    /**
     * 修改角色
     */
    handleUpdateElement=async () =>{
        try{
            const fields = this.props.form.getFieldsValue()
            const ret = await request({
                method: 'put',
                url: '/api/admin/role_type',
                data:{
                    code:fields.code,
                    name:fields.name,
                    description:fields.description,
                    modifiedUser:this.props.user.username,
                    id:this.state.currentId
                }
            });
            if(ret.code === 200){
                this.props.form.resetFields()
                this.props.toggleVisible(false)
                this.props.onCreate()
                message.success("更新成功")
                return
            }else{
                message.error((ret.message))
                return
            }
        }catch(err){
            console.log(err)
        }
    }

    /**添加角色 */
    handleAddElement = async () => {
        const fields = this.props.form.getFieldsValue()
        let res
        try{
            res = await request({
                headers: {
                    'content-type': 'application/json',
                },
                method: 'post',
                url: '/api/admin/role_type',
                data:{
                    code:fields.code,
                    name:fields.name,
                    description:fields.description,
                    modifiedUser:this.props.user.username,
                }
            })
        }catch(e){
            this.onCancel()
            return
        }
        if(res.code==200){
            this.props.form.resetFields()
            this.props.toggleVisible(false)
            this.props.onCreate()
            message.success('添加成功')
        } else{
            message.error(res.message)
            this.onCancel()
        }
    }

    componentDidMount(){
        this.props.onRef(this)
    }
    render() {
        const { visible , title } = this.props
        const { getFieldDecorator, getFieldValue } = this.props.form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }
        return (
            <Modal
                onCancel={this.onCancel}
                visible={visible}
                title='按钮或资源'
                centered
                onOk={this.handleOk}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'编码'}>
                        {getFieldDecorator('code', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '编码不能为空' },
                                { pattern: /^[^\s']+$/, message: '不能输入特殊字符' },
                                this.state.dialogStatus===''&&{validator:this.checkCodeUniqued}
                            ],
                           
                        })(
                            <Input
                                maxLength={50}
                                placeholder='请输入编码' />
                        )}
                    </Form.Item>
                    <Form.Item label={'类型名称'}>
                        {getFieldDecorator('name', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '类型名称不能为空' },
                                { pattern: /^[^\s']+$/, message: '不能输入特殊字符' },
                                { min: 3, message: '类型名称至少为3位' }
                            ]
                        })(
                            <Input
                                maxLength={16}
                                placeholder='请输入类型名称' />
                        )}
                    </Form.Item>

                    <Form.Item label={'描述'}>
                        {getFieldDecorator('description', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: 'description' },
                            ]
                        })(
                            <Input
                                placeholder='请输入描述' />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}


export default CreateModal;