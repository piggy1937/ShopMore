import React, { Component } from 'react';
import { Form, Input, message, Select } from 'antd'
import ProcessDesign from '@/pages/BaseManager/platform-manager/bpmn/ProcessDesign'
import {ProcessDesignConsumer} from './ProcessDesignProvider'
import Modal from '@/components/model'
class CreateProcessDesignModal extends Component {
   render(){
    const { visible } = this.props
       return (
        <ProcessDesignConsumer > 
            {
                ({toggle,handleToggle,handleOk}) =>(
                    <Modal visible={toggle} title='新建模型' width={'85%'}
                        bodyStyle={{height:'500px',padding:'0'}}
                        centered
                        onOk={()=>{handleOk()}}
                           destroyOnClose
                        onCancel={()=>{handleToggle()}}>   
                        <ProcessDesign  />
                    </Modal>
                )
            }
                
    </ProcessDesignConsumer>  
    )
   }
}

export default CreateProcessDesignModal;