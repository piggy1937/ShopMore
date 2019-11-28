import React, { createContext } from 'react'
import request from '@/utils/request'
 const ProcessDesignContext = createContext({
    toggle: false,
    handleToggle: () => {},
    handleOk:()=>{},
    initBpmnModeler:(model)=>{},
    modelId:-1,
    name:'',
    description:'',
    bpmnModeler:{}
})
export class ProcessDesignProvider extends React.Component {
    

    handleToggle = (modelId) => {
        this.setState({
             toggle: !this.state.toggle,
             modelId
        
        })
    }
    /***
     * 提交修改表单
     */
    handleOk=async ()=>{
        const {bpmnModeler,modelId} =this.state
        if(!bpmnModeler){
            console.log('bpmnModeler未初始化')
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
            svg_xml
        }
        const ret = await request({
            method:'put',
            url:`/api/admin/workflow/model/${modelId}`,
            data
        })
        console.log(ret)
        if(ret.code === 200){

        }else{
            
        }
    }
    /***
     * 初始化model
     */
    initBpmnModeler=(model)=>{
        console.log(model)
        this.setState({
            bpmnModeler:model
        })
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
        bpmnModeler:{}  
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