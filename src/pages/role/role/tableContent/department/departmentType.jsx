
import React from 'react'
import Navbar from './navbar'
import { Card, Button,Icon, Row, Col, Input,Form,Select,Popconfirm,message} from 'antd'
import { withRouter } from 'react-router-dom'
import request from '@/utils/request'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

@withRouter @Form.create()
class DepartMentType extends React.Component {
    constructor(props){
        super(props)
        this.state= {
            showElement: false,
        }
    }

    async componentDidMount() {
     //   await this.props.fetchRole()//获取所有的菜单
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
                                this.props.changeFormStatus({
                                    formStatus:'create',
                                    currentId:this.props.currentId,
                                    formEdit:false
                                })
                            }} >添加</Button>&emsp;
                            <Button type="primary" icon="edit" onClick={()=>{
                                this.props.changeFormStatus({
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
                            <Navbar getMenuInfo={this.fetchMenuInfo} type={this.state.type}></Navbar>
                        </Col>
                        <Col span={15} offset={1}>
                            <Card bordered={true}>
                                <Form  {...formItemLayout}>
                                    <Form.Item >
                                        {getFieldDecorator('id')(
                                            <Input type='hidden'/>,
                                        )}
                                    </Form.Item>
                                    <Form.Item label="标题">
                                        {getFieldDecorator('title', {
                                            rules: [{ required: true, message: 'Please input your username!' }],
                                        })(
                                            <Input
                                                disabled={this.props.formEdit}
                                                placeholder="请输入标题"
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
                                    <Form.Item label="图标">
                                        {getFieldDecorator('icon', {
                                            rules: [],
                                        })(
                                            <Input
                                                disabled={this.props.formEdit}
                                                placeholder="请输入图标"
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
                                            <Button type="primary" htmlType="submit" onClick={this.handleAddMenu}>
                                                保存
                                            </Button>&emsp;
                                            <Button type="primary"  onClick={this.handleCancle}>
                                                取消
                                            </Button>
                                        </div>
                                        <div  style={{display: formStatus==='update'?'inline-block':'none'}}>
                                            <Button type="primary" htmlType="submit" onClick={this.handleUpdateMenu}>
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
export  default  DepartMentType