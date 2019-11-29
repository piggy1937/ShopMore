import React, { createContext } from 'react'
import request from '@/utils/request'
import {  message } from 'antd'
 const ProcessDesignContext = createContext({
    toggle: false,
    handleToggle: () => {},
    handleOk:()=>{},
    initBpmnModeler:(model)=>{},
    modelId:-1,
    name:'',
    description:'',
    bpmnModeler:{},
     initXML:``
})
export class ProcessDesignProvider extends React.Component {
    

    handleToggle = (modelId) => {
        if(modelId){
            this.getModelInfo(modelId)
        }else{
            this.setState({
                toggle: !this.state.toggle,
                initXML:'',
                modelId
            })
        }
    }

    /**
     * 根据id 获取模型信息
     **/
    getModelInfo=async(modelId)=>{
       await request({
            method:'get',
            url:`/api/admin/workflow/model/${modelId}/json`
        }).then(data=>{
            const {name,description,model} =data.result
            if(data.code===200){
                this.setState({
                  name,description,initXML:model
                })
            }
        })
        this.setState({
            toggle: !this.state.toggle,
            modelId
        })
    }




    /***
     * 提交修改表单
     */
    handleOk=async ()=>{
        const {bpmnModeler,modelId,name,description} =this.state
        if(!bpmnModeler){
            return 
        }
        let json_xml = '',
            svg_xml = '';
            bpmnModeler.saveXML({format: true}, (err, xml) => {
            json_xml = xml;
        });
        bpmnModeler.saveSVG({format: true}, (err, data) => {
            svg_xml = data;
        });
        let data ={
            json_xml,
            svg_xml,
            name,
            description
        }
        const ret = await request({
            method:'put',
            url:`/api/admin/workflow/model/${modelId}`,
            data
        })
        if(ret.code === 200){
            this.handleToggle()
            message.success("编辑成功")
        }else{
            
        }
    }
    /***
     * 初始化model
     */
    initBpmnModeler=(model)=>{
        this.setState({
            bpmnModeler:model
        })
        console.log("initBp",model)
    }
    state = {
        toggle: false,
        handleToggle: this.handleToggle,
        initBpmnModeler:this.initBpmnModeler,
        handleOk:this.handleOk,
        modelId:-1,
        json_xml:'',
        svg_xml:'',
        name:'',
        description:'',
        bpmnModeler:{},
        initXML:``
    }

    render() {
        return (
            <ProcessDesignContext.Provider value={this.state}>
                {this.props.children}
            </ProcessDesignContext.Provider>
        ) 
    }
}

// 3. 创建 Consumer
const ProcessDesignConsumer = ProcessDesignContext.Consumer
export {ProcessDesignConsumer,ProcessDesignContext}

