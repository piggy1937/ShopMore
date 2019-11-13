import React, { Component } from 'react';
import {Form, Drawer, Button, Col, Row, Input, Select, Upload, Icon, message,TreeSelect } from 'antd';
import request  from '@/utils/request';
import { fetchRoleType} from '@/store/actions'
import {connect} from "react-redux";
import debounce from 'lodash/debounce';
const { Option } = Select;
const { TreeNode } = TreeSelect;
const store = connect(
    (state) => ({ user: state.user, websocket: state.websocket })
)
@store
@Form.create()
class CreateDrawer extends Component {
    constructor(props){
        super(props);
        this.state={
            uploading: false
        }
    }

    onClose = () => {
        this.props.form.resetFields()
        this.props.toggleVisible(false)
    }
    /**
     * 转换上传组件表单的值
     */
    _normFile =  (e) => {
        if (e.file.response && e.file.response.success) {
            var random = Math.ceil(Math.random() * 100000);
            return e.file.response.result+'?'+random
        } else {
            return ''
        }
    }

    customRequest = async (options) => {
        const formData = new FormData();
        const { file } = options
        formData.append('file', file);
        const ret = await request({
            processData: false,
            contentType: false,
            method: 'post',
            url: `/api/file/upload?fileType=image`,
            data: formData
        })
        const { code, result } = ret
        new Promise(function (resolve, reject) {
            options.onSuccess(ret, file)
            resolve('')
        }).then(ret=>{
            this.setState({
                uploading: false
            })
            message.success('上传头像成功')
        })
    }
    onChange = (info) => {
        if (info.file.status !== 'uploading') {
            this.setState({
                uploading: true
            })}
        if (info.file.status === 'done') {

        } else if (info.file.status === 'error') {
            this.setState({
                uploading: false
            })
            message.error(info.file.response.message || '上传头像失败')
        }
    }

    render() {
        const { visible } = this.props
        const { uploading } = this.state
        const { getFieldDecorator, getFieldValue } = this.props.form
        const avatar = getFieldValue('avatar')
        const uploadProps = {
            name: "avatar",
            listType: "picture-card",
            customRequest: this.customRequest,
            showUploadList:false,
            supportServerRender:true,
            accept: "image/*",
            onChange: this.onChange
        }
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }
        return (
            <Drawer
                title="编辑"
                width={720}
                onClose={this.onClose}
                visible={visible}
            >
                <Form layout="vertical" hideRequiredMark>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="账号姓名">
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: 'Please enter user name' }],
                                })(<Input placeholder="Please enter user name" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="性别">
                                {getFieldDecorator('sex', {
                                    rules: [{ required: true, message: 'Please select an owner' }],
                                })(
                                    <Select placeholder="请选择性别">
                                        <Option value="1">男</Option>
                                        <Option value="0">女</Option>
                                    </Select>,
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label={'头像'} {...formItemLayout}>
                                {getFieldDecorator('avatar', {
                                    rules: [{ required: true, message: '请上传用户头像' }],
                                    getValueFromEvent: this._normFile,     //将上传的结果作为表单项的值（用normalize报错了，所以用的这个属性）
                                })(
                                    <Upload {...uploadProps} style={styles.avatarUploader}>
                                        {avatar ? <img src={avatar} alt="avatar" style={styles.avatar} /> : <Icon style={styles.icon} type={uploading ? 'loading' : 'plus'} />}
                                    </Upload>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="角色">
                                {getFieldDecorator('roles', {
                                    rules: [{ required: true, message: 'Please select an owner' }],
                                })(
                                    <TreeSelect
                                        showSearch
                                        style={{ width: '100%' }}
                                        value={this.state.value}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        placeholder="Please select"
                                        allowClear
                                        multiple
                                        treeDefaultExpandAll
                                        onChange={this.onChange}
                                    >
                                        <TreeNode value="parent 1" title="parent 1" key="0-1">
                                            <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
                                                <TreeNode value="leaf1" title="my leaf" key="random" />
                                                <TreeNode value="leaf2" title="your leaf" key="random1" />
                                            </TreeNode>
                                            <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
                                                <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
                                            </TreeNode>
                                        </TreeNode>
                                    </TreeSelect>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e9e9e9',
                        padding: '10px 16px',
                        background: '#fff',
                        textAlign: 'right',
                    }}
                >
                    <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button onClick={this.onClose} type="primary">
                        Submit
                    </Button>
                </div>
            </Drawer>
        );
    }
}

const styles = {
    avatarUploader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        height: 150,
        backgroundColor: '#fff'
    },
    icon: {
        fontSize: 28,
        color: '#999'
    },
    avatar: {
        maxWidth: '100%',
        maxHeight: '100%',
    },
}
export default CreateDrawer;