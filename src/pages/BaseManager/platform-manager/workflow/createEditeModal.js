import React, { Component } from 'react';
import { Form, Input, message, Select } from 'antd'
import {WorkflowDesignConsumer} from './WorkflowDesignProvider'
import Modal from '@/components/model'
import WorkflowDesign from './WorkflowDegign'
class CreateEditeModal extends Component {
   render(){
    const { visible } = this.props
       return (
        <WorkflowDesignConsumer > 
            {
                ({toggle,handleToggle,handleOk}) =>(
                    <Modal visible={toggle} title='自定义流程' width={'85%'}
                        bodyStyle={{height:'500px',padding:'0'}}
                        centered
                        onOk={()=>{handleOk()}}
                           destroyOnClose
                        onCancel={()=>{handleToggle()}}>   
                        <WorkflowDesign/>
                    </Modal>
                )
            }
                
    </WorkflowDesignConsumer>  
    )
   }
}

export default CreateEditeModal;