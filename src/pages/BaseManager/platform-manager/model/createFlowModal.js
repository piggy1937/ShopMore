import React, { Component } from 'react';
import { Modal, Form, Input, message, Select } from 'antd'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchElement} from '@/store/actions'
import request from '@/utils/request'
const { Option } = Select;
const store = connect(
    (state) => ({
        currentId: state.menu.currentId
    }),
    (dispatch) => bindActionCreators({fetchElement}, dispatch)
)
@store
@Form.create()
class CreateFlowModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogStatus: '',
            methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
            typeOptions: ['uri', 'button'],
        }

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
    /**新增模型 */
    handleAddElement = async (values) => {
        try{
        const ret = await request({
            method: 'post',
            url: '/api/admin/workflow/model',
            data: values
            });
            if(ret.code === 200){
                this.props.form.resetFields()
                this.props.toggleVisible(false)
            }else{
                message.error((ret.message))
            }
        }catch(err){
            console.log(err)
        }
           
    }
    /**修改按钮或资源 */
    handleUpdateElement = async (values) => {
        try{
        const ret = await request({
            method: 'put',
            url: '/api/admin/element',
            data: values
            });
            if(ret.code === 200){
                this.props.form.resetFields()
                this.props.toggleVisible(false)
                this.props.fetchElement({ menuId:this.props.currentId})
            }else{
                message.error((ret.message))
            }
        }catch(err){
            console.log(err)
        }
           
    }
   /**初始化表格 */
   initForm=(data)=>{
       const {setFieldsValue} = this.props.form
       const {id,code,type,name,url,method} = data
       setFieldsValue({
        id,code,type,name,url,method,
        menuId:this.props.currentId
       })
       this.props.toggleVisible(true)
       this.setState({dialogStatus:'update'})
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
                visible={visible}
                title='新建模型'
                centered
                onOk={this.handleOk}
                onCancel={this.onCancel}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'编码'}>
                        {getFieldDecorator('key', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: 'key is required' },

                            ],
                            initialValue: ''
                        })(
                            <Input placeholder='请输入编码' />
                        )}
                    </Form.Item>
                    <Form.Item label={'名称'}>
                        {getFieldDecorator('name', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '名称不能为空' },
                                { pattern: /^[^\s']+$/, message: '不能输入特殊字符' },
                                { min: 3, message: '名称至少为3位' }
                            ]
                        })(
                            <Input
                                maxLength={50}
                                placeholder='请输入名称' />
                        )}
                    </Form.Item>

                    <Form.Item label={'说明'}>
                        {getFieldDecorator('description', {
                            validateFirst: true,
                            rules: [

                            ]
                        })(
                            <Input placeholder="请输入说明" />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default CreateFlowModal;