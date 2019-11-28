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
            isLoading:false,
            status:''
        }
        this.checkCodeUniqued = debounce(this.checkCodeUniqued, 1000);
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    onCancel = () => {
        this.props.form.resetFields()
        this.props.toggleVisible(false)
        this.setState({
            isLoading:false
        })
    }
    handleOk = () => {
        const {isLoading,status} = this.state
        this.props.form.validateFields((errors, values) => {
            if (!errors && !isLoading) {
                 if(status==='update'){
                     this.onUpdate(values)
                 } else{
                     this.onCreate(values)
                 }
            }
        })
    }


    /**
     * code是否存在
     */
    checkCodeUniqued =  (rule, value, callback)=>{
        request({
            headers: {
                'content-type': 'application/json',
            },
            method: 'get',
            url: '/api/admin/template/check_code',
            data: {
                code:value
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
     * 修改模板
     */
    onUpdate=()=>{
        const template = JSON.stringify(FormStudio.getJsonData());
        const {code,name,type,id} = this.props.form.getFieldsValue()
        debugger
        request({
            headers: {
                'content-type': 'application/json',
            },
            method: 'put',
            url: '/api/admin/template/',
            data: {
                code,name,type,id,template
            }
        }).then(data=>{
            if(data.code==200){
                this.onCancel()
                this.props.onRefresh()
            }
        })
    }


    /**创建模板 */
    onCreate = async () => {
        this.setState({
            isLoading:true
        })
        const template = JSON.stringify(FormStudio.getJsonData());

        const {code,name,type} = this.props.form.getFieldsValue()
        let res
        try{
            res = await request({
                headers: {
                    'content-type': 'application/json',
                },
                method: 'post',
                url: '/api/admin/template',
                data: {
                    code,name,type,template
                }
            })
            if(res.code==200){
                this.onCancel()
                this.props.onRefresh()
            }else{
                message.error(res.message)
            }
        }catch(e){
            return
        }
        this.setState({
            isLoading:false
        })
    }

    initTemplate=(data)=>{
        const {setFieldsValue} = this.props.form
        const {id,code,name,type} = data
        setFieldsValue({
            id,code,name,type
        })
        this.setState({
            status:'update'
        })
    }

    render() {
        const { visible } = this.props
        const {isLoading,status} = this.state;
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }
        return (
            <Modal
                visible={visible}
                title='模板管理'
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
                    <Form.Item label={'模板标识'}>
                        {getFieldDecorator('code', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '模板标识' },
                                { pattern: /^[^\s']+$/, message: '不能输入特殊字符' },
                                 status===''&&{validator:this.checkCodeUniqued}
                            ],
                        })(
                            <Input
                                disabled={status==="update"}
                                placeholder='请输入模板标识' />
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
                    <Form.Item label={'模板类型'}>
                        {getFieldDecorator('type', {
                            validateFirst: true,
                        })(
                            <Input
                                placeholder='模板类型' />
                        )}
                    </Form.Item>
                    <Form.Item >
                        {getFieldDecorator('id')(
                            <Input
                                type='hidden' />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}
export default CreateModal;