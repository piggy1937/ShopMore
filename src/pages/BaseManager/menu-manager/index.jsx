/***
 * 菜单管理界面
 */
import React from 'react'
import { Card, Button,Icon, Row, Col,Tree, Input,Form} from 'antd'
import { withRouter } from 'react-router-dom'
import Navbar from './navbar'
import MenuElement from './element'
@withRouter @Form.create()
class MenuManager extends React.Component{
    constructor(props){
        super(props)
        this.state={
            formStatus:''
        }
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const { Search } = Input;
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
                            <Button type="primary" icon='plus' >添加</Button>&emsp;
                            <Button type="primary" icon="edit">编辑</Button>&emsp;
                            <Button type="primary" icon="delete">删除</Button>
                        </div>
                    </Col>
                </Row>
                <Card bordered={true}>
                <Row style={{marginTop:'10px'}}>
                    <Col span={8}>
                         <Navbar></Navbar>
                    </Col>
                    <Col span={15} offset={1}>
                        <Card bordered={true}>
                        <Form  {...formItemLayout}>
                            <Form.Item label="路径编码">
                                {getFieldDecorator('code', {
                                    rules: [{ required: true, message: 'Please input your username!' }],
                                })(
                                    <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="请输入路径编码"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item label="标题">
                                {getFieldDecorator('title', {
                                    rules: [{ required: true, message: 'Please input your username!' }],
                                })(
                                    <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="请输入标题"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item label="父级节点">
                                {getFieldDecorator('parentId', {
                                    rules: [{ required: true, message: 'Please input your username!' }],
                                })(
                                    <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="请输入父级节点"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item label="图标">
                                {getFieldDecorator('icon', {
                                    rules: [{ required: true, message: 'Please input your username!' }],
                                })(
                                    <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="请输入图标"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item label="资源路径">
                                {getFieldDecorator('href', {
                                    rules: [{ required: true, message: 'Please input your username!' }],
                                })(
                                    <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="请输入资源路径"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item label="类型"> 
                                {getFieldDecorator('type', {
                                    rules: [{ required: true, message: 'Please input your username!' }],
                                })(
                                    <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="请输入资源请求类型"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item label="排序">
                                {getFieldDecorator('order', {
                                    rules: [{ required: true, message: 'Please input your username!' }],
                                })(
                                    <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="请输入排序"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item label="描述">
                                {getFieldDecorator('description', {
                                    rules: [{ required: true, message: 'Please input your username!' }],
                                })(
                                    <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="请输入描述"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">
                                    保存
                                </Button>&emsp;
                                <Button type="primary" htmlType="submit">
                                   取消
                                </Button>
                            </Form.Item>
                        </Form>    
                        </Card>
                        <Card bordered={true} title="按钮或资源">
                            <MenuElement></MenuElement>
                        </Card>    

                     </Col>   
                </Row>
                </Card>
            </div>    

        )
    }
}
export default MenuManager