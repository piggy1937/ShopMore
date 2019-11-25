import React from 'react'
import { Form, Row, Col, Input, Button, Icon,message } from 'antd';
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setDynamicForm} from '@/store/actions'
const store = connect(
    (state) => ({
     }),
    (dispatch) => bindActionCreators({setDynamicForm}, dispatch)
  )
  @store @Form.create()
class BaseInfo extends React.Component{
    setFormData=()=>{
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
              this.props.setDynamicForm(values);
            }
        })
    }
   
    componentDidMount(){
        this.props.onRef(this)
    }
    render(){
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 5 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 19 },
            },
          };
          const tailFormItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2, offset: 1, },
              },
            wrapperCol: {
              xs: {
                span: 18,
              },
              sm: {
                span: 18,
              },
            },
          };
        const { getFieldDecorator } = this.props.form;
        return (
            <Form {...formItemLayout} onSubmit={this.handleSearch}>
            <Row gutter={24}>
                <Col span={12} >
                    <Form.Item label='表单ID'>
                        {getFieldDecorator(`id`, {
                        rules: [
                            {
                            required: true,
                            message: 'Input something!',
                            },
                        ],
                        })(<Input placeholder="只能由字母数字下划线组成" />)}
                    </Form.Item>
                </Col>
                <Col span={12} >
                    <Form.Item label='绑定数据源'>
                        {getFieldDecorator(`dataSourceId`, {
                        rules: [
                        ],
                        })(<Input placeholder="默认数据源" />)}
                    </Form.Item>
                </Col>,
            </Row>
            <Row gutter={24}>
                <Col span={12} >
                    <Form.Item label='表单名称'>
                        {getFieldDecorator(`name`, {
                        rules: [
                            {
                            required: true,
                            message: 'Input something!',
                            },
                        ],
                        })(<Input placeholder="只能由字母数字下划线组成" />)}
                    </Form.Item>
                </Col>
                <Col span={12} >
                    <Form.Item label='表单类型'>
                        {getFieldDecorator(`type`, {
                        rules: [
                        ],
                        })(<Input placeholder="默认数据源" />)}
                    </Form.Item>
                </Col>,
            </Row>
            <Row gutter={24}>
                <Col span={12} >
                    <Form.Item label='物理表名'>
                        {getFieldDecorator(`databaseTableName`, {
                        rules: [
                            {
                            required: true,
                            message: 'Input something!',
                            },
                        ],
                        })(<Input placeholder="只能由字母数字下划线组成" />)}
                    </Form.Item>
                </Col>
                <Col span={12} >
                    <Form.Item label='别名'>
                        {getFieldDecorator(`alias`, {
                        rules: [
                        ],
                        })(<Input placeholder="默认数据源" />)}
                    </Form.Item>
                </Col>,
            </Row>
            <Row gutter={24}>
                <Col span={24} >
                    <Form.Item label='备注'  {...tailFormItemLayout}>
                        {getFieldDecorator(`describe`, {
                        rules: [
                            {
                            required: true,
                            message: 'Input something!',
                            },
                        ],
                        })(<Input.TextArea rows={4} />)}
                    </Form.Item>
                </Col>
            </Row>
          </Form>
        
        
        
        
        
        
        );
    }
}
export default BaseInfo