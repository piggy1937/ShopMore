import React from 'react'
import { Form, Input, Row, Col } from 'antd'
import { withRouter } from 'react-router-dom'
import '~@/style.less'
@withRouter
@Form.create()
class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            focusItem: -1,   //当前焦点聚焦在哪一项上
            code: ''  //验证码
        }
    }
    render() {
        const { getFieldDecorator, getFieldError } = this.props.form
        const { focusItem, code } = this.state
        return (
            <div className="login-container">
                <h3 className="title">管理员登录</h3>
                <Form >
                    <Form.Item
                        style={{ marginBottom: 10 }}
                        wrapperCol={{ span: 20, pull: focusItem === 0 ? 1 : 0 }}
                        labelCol={{ span: 3, pull: focusItem === 0 ? 1 : 0 }}
                        label={<span className='iconfont icon-User' style={{ opacity: focusItem === 0 ? 1 : 0.6 }} />}
                        colon={false}>
                        {getFieldDecorator('username', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '请输入用户名' },
                                { pattern: /^[^\s']+$/, message: '不能输入特殊字符' },
                            ]
                        })(
                            <Input
                                className="myInput"
                                onFocus={() => this.setState({ focusItem: 0 })}
                                onBlur={() => this.setState({ focusItem: -1 })}
                                onPressEnter={this.onSubmit}
                                placeholder="用户名"
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: 10 }}
                        wrapperCol={{ span: 20, pull: focusItem === 1 ? 1 : 0 }}
                        labelCol={{ span: 3, pull: focusItem === 1 ? 1 : 0 }}
                        label={<span className='iconfont icon-suo1' style={{ opacity: focusItem === 1 ? 1 : 0.6 }} />}
                        colon={false}>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码' }]
                        })(
                            <Input
                                className="myInput"
                                type="password"
                                onFocus={() => this.setState({ focusItem: 1 })}
                                onBlur={() => this.setState({ focusItem: -1 })}
                                onPressEnter={this.onSubmit}
                                placeholder="密码"
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: 20 }}
                        wrapperCol={{ span: 20, pull: focusItem === 2 ? 1 : 0 }}
                        labelCol={{ span: 3, pull: focusItem === 2 ? 1 : 0 }}
                        label={<span className='iconfont icon-securityCode-b' style={{ opacity: focusItem === 2 ? 1 : 0.6 }} />}
                        colon={false}>
                        <Row gutter={8}>
                            <Col span={15}>
                                {getFieldDecorator('captcha', {
                                    validateFirst: true,
                                    rules: [
                                        { required: true, message: '请输入验证码' },
                                        {
                                            validator: (rule, value, callback) => {
                                                if (value.length >= 4 && code.toUpperCase() !== value.toUpperCase()) {
                                                    callback('验证码错误')
                                                }
                                                callback()
                                            }
                                        }
                                    ]
                                })(
                                    <Input
                                        className="myInput"
                                        onFocus={() => this.setState({ focusItem: 2 })}
                                        onBlur={() => this.setState({ focusItem: -1 })}
                                        onPressEnter={this.onSubmit}
                                        placeholder="验证码"
                                    />
                                )}
                            </Col>
                            <Col span={9}>
                                <canvas onClick={this.changeCaptcha} width="80" height='40' ref={el => this.canvas = el} />
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item>
                        <div className="btn-box">
                            <div className="loginBtn" onClick={this.onSubmit}>登录</div>
                            <div className="registerBtn" onClick={this.goRegister}>注册</div>
                        </div>
                    </Form.Item>
                </Form>

                <div className="footer">欢迎登陆后台管理系统</div>
            </div>
        );
    }

}
export default Login