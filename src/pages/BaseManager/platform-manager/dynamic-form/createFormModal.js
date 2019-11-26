import React, { Component } from 'react';
import { Modal, Form, Input, message, Select,Tabs} from 'antd'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchElement,setDynamicFormColumn} from '@/store/actions'
import request from '@/utils/request'
import LoadableComponent from '@/utils/LoadableComponent'
const BaseInfoPane = LoadableComponent(import('./tabpane/baseInfo'), true);
const FieldSetPane = LoadableComponent(import('./tabpane/fieldSet'), true);

const { TabPane } = Tabs;
const { Option } = Select;
const store = connect(
    (state) => ({
        formData: state.dynamicForm.form,
        columns:state.dynamicForm.colums,
    }),
    (dispatch) => bindActionCreators({fetchElement,setDynamicFormColumn}, dispatch)
)
@store
class CreateFormModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogStatus: '',
            methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
            typeOptions: ['uri', 'button'],
            form:{}
        }

    }
    onCancel = () => {
        this.props.toggleVisible(false)
        this.props.setDynamicFormColumn({
            form:{},
            columns:[],
            fieldDataSource:[]
        })
    }
    handleOk = async () => {
      await this.baseInfoRef.setFormData()
      this.handleAddElement({
          form:this.props.formData,
          columns:this.props.columns
      })
    }
   
      /**新建表单 */
      handleAddElement = async (values) => {
        try{
        const ret = await request({
            method: 'post',
            url: '/api/admin/dynamic/form/bind',
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
    /**父子组件调用 */
    onBaseInfoRef = (ref) => {
        this.baseInfoRef = ref
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
    callback=(key)=> {
     console.log(key);
    }
   
    render() {
        const { visible } = this.props
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }
        
        return (
            <Modal
                visible={visible}
                title='新建表单'
                width={'70%'}
                centered
                onOk={this.handleOk}
                onCancel={this.onCancel}
            >
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="基本信息" key="baseInfo">
                     <BaseInfoPane onRef={this.onBaseInfoRef}/>
                    </TabPane>
                    <TabPane tab="字段设置" key="fieldSet">
                    <FieldSetPane/>
                    </TabPane>
                    <TabPane tab="表关联设置" key="refTabSet">
                    表关联设置
                    </TabPane>
                    <TabPane tab="触发器设置" key="triggerSet">
                    触发器设置
                    </TabPane>
                </Tabs>
            </Modal>
        );
    }
}

export default CreateFormModal;