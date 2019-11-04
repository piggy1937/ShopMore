import React, { Component } from 'react';
import { Modal, Form, Input, message } from 'antd';
import request  from '@/utils/request';
import Promptbox from '@/components/PromptBox/index'
import {connect} from "react-redux";
// import { post } from '../../utils/ajax'

@Form.create()
class CreateModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkName:'',
            required:false
        }
        this.verifyClass = debounce(this.verifyClass, 1000)
    }


    onCancel = () => {
        this.props.form.resetFields()
        this.props.toggleVisible(false)
    }
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors&&this.state.required) {
                this.onCreate(values)
            }
        })
    }
    handleKeyUp = (e) => {
        this.verifyClass(e.target.value) // 对用户输入进行判断
    }


    verifyClass =async (username) => {
        let res
        try {
            res = await request({
                headers: {
                    'content-type': 'application/json',
                },
                method: 'get',
                url: '/api/job/check',
                data: {
                    jobClassName: username
                }
            })
        } catch (e) {
            return
        }
        if(res.code!=200){
            this.setState({
                required:false,
                checkName:res.message
            })
            message.warn("类名不存在")
        }
        if(res.code==200){
            this.setState({
                tip:null,
                required:true
            })
        }
    }



    onCreate = async () => {
        this.setState({
            required:false
        })
        const fields = this.props.form.getFieldsValue()
        let res
        try{
            res = await request({
                headers: {
                    'content-type': 'application/json',
                },
                method: 'post',
                url: '/api/job',
                data: {
                    jobClassName:fields.jobClassName,
                    jobGroupName:fields.jobGroupName,
                    cronExpression:fields.cronExpression,
                    jobType:fields.jobType,
                    timeType:fields.timeType
                }
            })
        }catch(e){
            this.onCancel()
            this.setState({
                isLoading: false,
            })
            return
        }
        if(res.code==200){
            this.onCancel()
            this.props.onCreate()
            message.success('添加成功')
            return
        } else if(res.message ==='Cron格式不正确'){
            message.error(res.message)
            this.setState({
                required:true
            })
            return
        }else{
            message.error(res.message)
            this.onCancel()
            return
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
                title='新增定时'
                centered
                onOk={this.handleOk}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'定时类名'}>
                        {getFieldDecorator('jobClassName', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '定时类名不能为空' },
                                { pattern: /^[^\s']+$/, message: '不能输入特殊字符' },
                            ],
                        })(
                            <Input
                                onKeyUp={ this.handleKeyUp }
                                maxLength={50}
                                placeholder='请输入类名称' />
                        )}
                    </Form.Item>
                    <Form.Item label={'分组名称'}>
                        {getFieldDecorator('jobGroupName', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '分组名称不能为空' },
                                { pattern: /^[^\s']+$/, message: '不能输入特殊字符' },
                                { min: 3, message: '用户名至少为3位' }
                            ]
                        })(
                            <Input
                                maxLength={16}
                                placeholder='请输入分组名称' />
                        )}
                    </Form.Item>

                    <Form.Item label={'cron表达式'}>
                        {getFieldDecorator('cronExpression', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: 'cron表达式不能为空' },
                            ]
                        })(
                            <Input
                                maxLength={16}
                                placeholder='请输入cron表达式' />
                        )}
                    </Form.Item>
                    <Form.Item label={ 'job类型'}>
                        {
                            <Input placeholder='请输入job类型' />
                        }
                    </Form.Item>
                    <Form.Item label={ '时间类型'}>
                        {(
                            <Input placeholder='请输入时间类型' />
                        )}
                    </Form.Item>
                </Form>

            </Modal>
        );
    }
}
function debounce(fn, ms) {
    let timeoutId
    return function () {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            fn.apply(this, arguments)
        }, ms)
    }
}

export default CreateModal;