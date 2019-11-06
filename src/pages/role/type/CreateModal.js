import React, { Component } from 'react';
import { Modal, Form, Input, message } from 'antd';
import request  from '@/utils/request';
import Promptbox from '@/components/PromptBox/index'
import {connect} from "react-redux";
import debounce from 'lodash/debounce';
const store = connect(
    (state) => ({ user: state.user})
  )
@store
@Form.create()
class CreateModal extends Component {
    constructor(props) {
        super(props)
    }


    onCancel = () => {
        this.props.form.resetFields()
        this.props.toggleVisible(false)
    }
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.onCreate(values)
            }
        })
    }



    /**添加角色 */
    onCreate = async () => {
        this.setState({
            isLoading:true
        })
        const fields = this.props.form.getFieldsValue()
        let res
        try{
            res = await request({
                headers: {
                    'content-type': 'application/json',
                },
                method: 'post',
                url: '/api/admin/role',
                data:fields
            })
        }catch(e){
            this.onCancel()
            return
        }
        if(res.code==200){
            this.onCancel()
            this.props.onCreate()
            message.success('添加成功')
        } else{
            message.error(res.message)
            this.onCancel()
        }
    }
    render() {
        const { visible } = this.props
        const { getFieldDecorator, getFieldValue } = this.props.form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }
        return (
            <Modal
                onCancel={this.onCancel}
                visible={visible}
                title='新增角色'
                centered
                onOk={this.handleOk}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'角色编码'}>
                        {getFieldDecorator('code', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '角色编码不能为空' },
                                { pattern: /^[^\s']+$/, message: '不能输入特殊字符' }
                            ],
                           
                        })(
                            <Input
                                maxLength={50}
                                placeholder='请输入角色编码' />
                        )}
                    </Form.Item>
                    <Form.Item label={'角色类型'}>
                        {getFieldDecorator('type', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '角色类型不能为空' },
                                { pattern: /^[^\s']+$/, message: '不能输入特殊字符' },
                                { min: 3, message: '角色类型至少为3位' }
                            ]
                        })(
                            <Input
                                maxLength={16}
                                placeholder='请输入角色类型' />
                        )}
                    </Form.Item>

                    <Form.Item label={'角色描述'}>
                        {getFieldDecorator('description', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: 'description' },
                            ]
                        })(
                            <Input
                                placeholder='请输入角色描述' />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}


export default CreateModal;