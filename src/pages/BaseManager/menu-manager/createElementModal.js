import React, { Component } from 'react';
import { Modal, Form, Input, message, Select } from 'antd'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import request from '@/utils/request'
const { Option } = Select;
const store = connect(
    (state) => ({
        currentId: state.menu.currentId
    }),
    (dispatch) => bindActionCreators({}, dispatch)
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
                this.handleAddElement(values)
            }
        })
    }
    /**新增按钮或资源 */
    handleAddElement = async (values) => {
        const ret = await request({
            method: 'post',
            url: '/api/admin/element',
            data: values
            });
            console.log(ret)
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
                                maxLength={16}
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
                                        return (<Option value={e}>{e}</Option>)
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
                                        return (<Option value={e}>{e}</Option>)
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