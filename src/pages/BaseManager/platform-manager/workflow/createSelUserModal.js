import React, { Component } from 'react';
import {Modal, Form, Input, message, Select } from 'antd'
import {WorkflowDesignConsumer} from './WorkflowDesignProvider'
import WorkflowDesign from './WorkflowDegign'
class CreateSelUserModal extends Component {
   render(){
       return (
        <WorkflowDesignConsumer > 
            {
                ({toggleSelUserModal,handleSelUserToggle,handleOk}) =>(
                    <Modal visible={toggleSelUserModal} title='选择用户' width={'30%'}
                        bodyStyle={{height:'500px',padding:'0'}}
                        centered
                        onOk={()=>{handleOk()}}
                           destroyOnClose
                        onCancel={()=>{handleSelUserToggle()}}>   
                        <WorkflowDesign/>
                    </Modal>
                )
            }
                
    </WorkflowDesignConsumer>  
    )
   }
}

export default CreateSelUserModal;