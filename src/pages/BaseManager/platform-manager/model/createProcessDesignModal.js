import React, { Component } from 'react';
import { Modal, Form, Input, message, Select } from 'antd'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import request from '@/utils/request'
import ProcessDesign from '@/pages/BaseManager/platform-manager/bpmn/ProcessDesign'
import Styles from './modal.module.less'
const { Option } = Select;
const store = connect(
    (state) => ({
        
    }),
    (dispatch) => bindActionCreators({}, dispatch)
)
@store
class CreateProcessDesignModal extends Component {
    onCancel = () => {
        this.props.toggleVisible(false)
    }
    handleOk = () => {
    }
   render(){
    const { visible } = this.props
       return (<Modal
        visible={visible}
        title='新建模型'
        width={'85%'}
        bodyStyle={{height:'500px',padding:'0'}}
        centered
        onOk={this.handleOk}
        onCancel={this.onCancel}
    >   
        <ProcessDesign/>
    </Modal>)
   }
}

export default CreateProcessDesignModal;