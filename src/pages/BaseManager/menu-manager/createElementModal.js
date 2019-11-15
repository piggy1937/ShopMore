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
class CreateElementModal extends Component {
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
    /**新增按钮或资源 */
    handleAddElement = async (values) => {
        try{
        const ret = await request({
            method: 'post',
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

    componentDidMount(){
        this.props.onRef(this)
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
                title='按钮或资源'
                centered
                onOk={this.handleOk}
                onCancel={this.onCancel}
            >
                <Form {...formItemLayout}>
                    <Form.Item >
                        {getFieldDecorator('menuId', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '资源编码不能为空' },

                            ],
                            initialValue: this.props.currentId
                        })(
                            <Input placeholder='请选择菜单' hidden />
                        )}
                    </Form.Item>
                    <Form.Item >
                        {getFieldDecorator('id')(
                            <Input  hidden />
                        )}
                    </Form.Item>
                    <Form.Item label={'资源编码'}>
                        {getFieldDecorator('code', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '资源编码不能为空' },
                                { pattern: /^[^\s']+$/, message: '不能输入特殊字符' },
                                { min: 3, message: '资源编码至少为3位' }
                            ]
                        })(
                            <Input
                                maxLength={50}
                                placeholder='请输入资源编码' />
                        )}
                    </Form.Item>

                    <Form.Item label={'资源类型'}>
                        {getFieldDecorator('type', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '资源类型不能为空' },
                            ]
                        })(
                            <Select style={{ width: 120 }} placeholder="请输入资源类型">

                                {
                                    this.state.typeOptions.map(e => {
                                        return (<Option key={e}  value={e}>{e}</Option>)
                                    })
                                }

                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label={'资源名称'}>
                        {getFieldDecorator('name', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '资源名称不能为空' },

                            ]
                        })(
                            <Input placeholder="请输入资源名称" />
                        )}
                    </Form.Item>
                    <Form.Item label={'资源地址'}>
                        {getFieldDecorator('url', {
                            validateFirst: true
                        })(
                            <Input placeholder="请输入资源地址" />
                        )}
                    </Form.Item>
                    <Form.Item label={'请求类型'}>
                        {getFieldDecorator('method', {
                            validateFirst: true,
                            initialValue: 'GET'
                        })(

                            <Select style={{ width: 120 }} placeholder="请输入资源请求类型">

                                {
                                    this.state.methodOptions.map(e => {
                                        return (<Option key={e} value={e}>{e}</Option>)
                                    })
                                }

                            </Select>

                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default CreateElementModal;