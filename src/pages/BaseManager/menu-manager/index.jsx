/***
 * 菜单管理界面
 */
import React from 'react'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, Button,Icon, Row, Col,Tree, Input,Form,Select} from 'antd'
import { withRouter } from 'react-router-dom'
import Navbar from './navbar'
import MenuElement from './element'
import request from '@/utils/request'
import debounce from 'lodash/debounce';
import { changeFormStatus} from '@/store/actions'
const store = connect(
    (state) => ({formStatus:state.menu.formStatus,formEdit:state.menu.formEdit}),
    (dispatch) => bindActionCreators({changeFormStatus}, dispatch)
)
@withRouter @Form.create()
@store
class MenuManager extends React.Component{
    constructor(props){
        super(props)
        this.state={ 
            typeOptions: ['MENU', 'DIRT'],
        }
        this.checkCodeUniqued = debounce(this.checkCodeUniqued, 500);
        this.checkCodeUniquedForUpdate = debounce(this.checkCodeUniquedForUpdate, 500);
    }


   
    /**
     * 添加新菜单
     */
    handleAddMenu = ()=>{
        this.props.form.validateFields(async (errors, values) => {
            if (!errors) {
                const ret2= await request({
                    method:'post',
                    url: '/api/admin/menu',
                    data:values
                })
            }
        });
    }
    /**
     * 更新菜单
     */
    handleUpdateMenu = ()=>{
        this.props.form.validateFields(async (errors, values) => {
            if (!errors) {
                const ret2= await request({
                    method:'put',
                    url: '/api/admin/menu',
                    data:values
                })
            }
        });
    }

    /***
     * 获取菜单信息
     */
    fetchMenuInfo= (id)=>{
        request({
            method:'get',
            url:'/api/admin/menu',
            data:{id}
        }).then(res=>{
            if(res.code===200){
              const {setFieldsValue} =this.props.form
              const {id,code,title,icon,href,type,order,description} = res.result
              setFieldsValue({
                  id,
                code,
                title,
                icon,
                href,
                type,
                order,
                description
              })
            }   
        }).catch(err=>{
            console.log(err)
        })
    }
    /**
    * 检测路径编码是否存在
    */
   checkCodeUniqued =  (rule, value, callback)=>{
      
       request({
           headers: {
               'content-type': 'application/json',
           },
           method: 'get',
           url: '/api/admin/menu/check_code',
           data: {
               code: value
           }
       }).then(data=>{
           console.log(data)
           const {code,message} = data
         if(code===200){
           callback();
         }else{
            
            if(this.props.formStatus === 'create'){
                callback(message); 
            } else{
                callback();
            }
           
         }
       }).catch(err=>{
           callback(err);
       })
       
   }
    /**
    * 检测路径编码用于更新是否存在
    */
   checkCodeUniquedForUpdate =  (rule, value, callback)=>{
      const {getFieldValue} = this.props.form
       let id = getFieldValue('id')
       request({
           headers: {
               'content-type': 'application/json',
           },
           method: 'get',
           url: '/api/admin/menu/check_code',
           data: {
               code: value,
               id:id
           }
       }).then(data=>{
           console.log(data)
           const {code,message} = data
         if(code===200){
           callback();
         }else{
            
            if(this.props.formStatus === 'create'){
                callback(message); 
            } else{
                callback();
            }
           
         }
       }).catch(err=>{
           callback(err);
       })
       
   }

    render(){
        const { getFieldDecorator } = this.props.form;
        const {formStatus} = this.props
        const { Search } = Input;
        const { Option } = Select;
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
                            <Button type="primary" icon='plus' onClick={()=>{this.props.changeFormStatus({
                                formStatus:'create'
                            })}} >添加</Button>&emsp;
                            <Button type="primary" icon="edit" onClick={()=>{this.props.changeFormStatus({
                                formStatus:'update'
                            })}}>编辑</Button>&emsp;
                            <Button type="primary" icon="delete">删除</Button>
                        </div>
                    </Col>
                </Row>
                <Card bordered={true}>
                <Row style={{marginTop:'10px'}}>
                    <Col span={8}>
                         <Navbar getMenuInfo={this.fetchMenuInfo}></Navbar>
                    </Col>
                    <Col span={15} offset={1}>
                        <Card bordered={true}>
                        <Form  {...formItemLayout}>
                             <Form.Item >
                                {getFieldDecorator('id')(
                                    <Input type='hidden'/>,
                                )}
                            </Form.Item>
                            <Form.Item label="路径编码">
                                {getFieldDecorator('code', {
                                    rules: [{ required: true, message: 'Please input your username!' },
                                            this.props.formStatus==='create'&&{validator:this.checkCodeUniqued},
                                            this.props.formStatus === 'update'&&{validator:this.checkCodeUniquedForUpdate}
                                            ],
                                })(
                                    <Input
                                    placeholder="请输入路径编码"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item label="标题">
                                {getFieldDecorator('title', {
                                    rules: [{ required: true, message: 'Please input your username!' }],
                                })(
                                    <Input
                                    placeholder="请输入标题"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item label="父级节点">
                                {getFieldDecorator('parentId', {
                                    rules: [],
                                })(
                                    <Input
                                    placeholder="请输入父级节点"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item label="图标">
                                {getFieldDecorator('icon', {
                                    rules: [],
                                })(
                                    <Input
                                    placeholder="请输入图标"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item label="资源路径">
                                {getFieldDecorator('href', {
                                    rules: [{ required: true, message: 'Please input your username!' }],
                                })(
                                    <Input
                                    placeholder="请输入资源路径"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item label="类型"> 
                                {getFieldDecorator('type', {
                                    rules: [{ required: true, message: 'Please input your type!' }],
                                    initialValue: 'MENU' 
                                })(
                                    <Select
                                        style={{ width: 180 }}
                                        placeholder="请选择请求类型"
                                    >   
                                    {
                                        this.state.typeOptions.map(item=>{
                                            return( <Option key={item} value={item}>{item}</Option>)
                                        })
                                    }
                                    </Select>,
                                )}
                            </Form.Item>
                            <Form.Item label="排序">
                                {getFieldDecorator('order', {
                                    rules: [],
                                })(
                                    <Input
                                    placeholder="请输入排序"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item label="描述">
                                {getFieldDecorator('description', {
                                    rules: [],
                                })(
                                    <Input
                                    placeholder="请输入描述"
                                    />,
                                )}
                            </Form.Item>
                            
                            <Form.Item {...tailFormItemLayout} >
                                <div style={{display: formStatus==='create'?'inline-block':'none'}}>
                                    <Button type="primary" htmlType="submit" onClick={this.handleAddMenu}>
                                        保存
                                    </Button>&emsp;
                                    <Button type="primary" htmlType="submit">
                                        取消
                                    </Button>
                                </div>
                                <div  style={{display: formStatus==='update'?'inline-block':'none'}}>
                                    <Button type="primary" htmlType="submit" onClick={this.handleUpdateMenu}>
                                    更新
                                    </Button>&emsp;
                                    <Button type="primary" htmlType="submit">
                                    取消
                                    </Button>
                                </div>
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