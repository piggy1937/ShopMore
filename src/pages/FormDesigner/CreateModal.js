import React, { Component } from 'react';
import { Modal, Form, Input, message ,Button} from 'antd';
import request  from '@/utils/request';
import { withRouter } from 'react-router';
import {connect} from "react-redux";
import debounce from 'lodash/debounce';
import FormStudio from "./utils/FormStudio";
const store = connect(
    (state) => ({ user: state.user, websocket: state.websocket })
)
@store
@Form.create()@withRouter
class CreateModal extends Component {
    constructor(props) {
        super(props)
        this.state={
            isLoading:false
        }
        this.checkTableNameUniqued = debounce(this.checkTableNameUniqued, 1000);
    }


    onCancel = () => {
        this.props.form.resetFields()
        this.props.toggleVisible(false)
        this.setState({
            isLoading:false
        })
    }
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors && !this.state.isLoading) {
                this.onCreate(values)
            }
        })
    }


    /**
     * code是否存在
     */
    checkTableNameUniqued =  (rule, value, callback)=>{
        request({
            headers: {
                'content-type': 'application/json',
            },
            method: 'get',
            url: '/api/admin/template/check_code',
            data: {
                databaseTableName:value
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



    /**创建表单 */
    onCreate = async () => {
        this.setState({
            isLoading:true
        })
        const correlations = JSON.stringify(FormStudio.getJsonData());

        const field = this.props.form.getFieldsValue()
        const {username} = this.props.user
        let res
        try{
            res = await request({
                headers: {
                    'content-type': 'application/json',
                },
                method: 'post',
                url: '/api/admin/template',
                data: {
                      name:field.name,
                      databaseTableName:field.databaseTableName,
                      describe:field.describe,
                      creatorId:username,
                      correlations
                }
            })
        }catch(e){
            this.onCancel()
            this.setState({
                isLoading: false,
            })
            return
        }
        if(res.code===200){
            this.onCancel()
            message.success('添加成功')
            this.props.history.push('/')
        }else{
            message.error(res.message)
        }
        this.setState({
            isLoading:false
        })
    }

    render() {
        const { visible } = this.props
        const {isLoading} = this.state;
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }
        return (
            <Modal
                visible={visible}
                title='表单'
                centered
                onCancel={this.onCancel}
                onOk={this.handleOk}
                footer={[
                    <Button key="back" onClick={this.onCancel}>
                        Return
                    </Button>,
                    <Button key="submit" type="primary" loading={isLoading} onClick={this.handleOk}>
                        Submit
                    </Button>,
                ]}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'数据库表名'}>
                        {getFieldDecorator('databaseTableName', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '编码不能为空' },
                                { pattern: /^[^\s']+$/, message: '不能输入特殊字符' },
                                {validator:this.checkTableNameUniqued}
                            ],
                           
                        })(
                            <Input
                                placeholder='请输入表名' />
                        )}
                    </Form.Item>
                    <Form.Item label={'名称'}>
                        {getFieldDecorator('name', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '名称不能为空' },
                                { pattern: /^[^\s']+$/, message: '不能输入特殊字符' },
                            ]
                        })(
                            <Input
                                maxLength={16}
                                placeholder='请输入表单名称' />
                        )}
                    </Form.Item>
                    <Form.Item label={'备注'}>
                        {getFieldDecorator('describe', {
                            validateFirst: true,
                        })(
                            <Input
                                placeholder='备注' />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}
export default CreateModal;