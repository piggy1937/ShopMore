import React, { createContext } from 'react'
import request from '@/utils/request'
import {  message } from 'antd'
 const WorkflowDesignContext = createContext({
    toggle: false,
    handleToggle: () => {},
    handleOk:()=>{},
    initBpmnModeler:(model)=>{},
    bpmnModeler:{},
   
})
export class WorkflowDesignProvider extends React.Component {


    handleToggle = (processId) => {
        if(processId){
            this.getModelInfo(processId)
        }else{
            this.setState({
                toggle: !this.state.toggle,
                initXML:'',
                processId
            })
        }
    }
    /***
     * 初始化model
     */
    initBpmnModeler=(model)=>{
        this.setState({
            bpmnModeler:model
        })
    }
    handleOk=()=>{}
    /**
     * 根据id 获取模型信息
     **/
    getModelInfo=async(processId)=>{
        await request({
             method:'get',
             url:`/api/admin/workflow/process/definition/json`,
             data:{processId}
         }).then(data=>{
             const {name,description,model} =data.result
             if(data.code===200){
                 this.setState({
                   name,description
                 })
             if(model.startsWith("<?xml")){
                    this.setState({
                        initXML:model
                    })
                }
             }
         })
         this.setState({
             toggle: !this.state.toggle,
             processId
         })
     }
    state = {
        toggle: false,
        handleToggle: this.handleToggle,
        handleOk:this.handleOk,
        initBpmnModeler: this.initBpmnModeler
    }
    render() {
        return (
            <WorkflowDesignContext.Provider value={this.state}>
                {this.props.children}
            </WorkflowDesignContext.Provider>
        )
    }
}

// 3. 创建 Consumer
const WorkflowDesignConsumer = WorkflowDesignContext.Consumer
export {WorkflowDesignConsumer,WorkflowDesignContext}

