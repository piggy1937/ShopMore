import React, { Component } from 'react';
import styles from './WorkflowEditor/workflow.module.less';
import BpmnModeler from './WorkflowEditor/modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import {WorkflowDesignContext} from './WorkflowDesignProvider'
import propertiesProviderModule from './WorkflowEditor/modeler/customer/Toolbar';
import { notification} from 'antd';
/**
 * 工作流自定义
 */
class WorkflowDesign extends Component {
     // 折叠
     handlePanelFold = () => {
        const {hidePanel} = this.state;
        this.setState(
            {
                hidePanel: !hidePanel,
                hideCount: 1,
            },
            () => {}
        );
    };
    componentDidMount(){
        let contect = this.context;
        const bpmnModeler = new BpmnModeler({
            container: '#canvas',
            propertiesPanel: {
                parent: '#properties-panel',
            },
            additionalModules: [propertiesPanelModule, propertiesProviderModule],
            moddleExtensions: {
                camunda: camundaModdleDescriptor,
            },
        });
        this.bpmnModeler = bpmnModeler
        this.renderDiagram(bpmnModeler,contect.initXML);
        contect.initBpmnModeler(bpmnModeler)
        this.addEventBusListener()
    }
      // 监听 element
    addEventBusListener = ()=>{
        let that = this
        const eventBus = this.bpmnModeler.get('eventBus')
        const modeling = this.bpmnModeler.get('modeling')
        const elementRegistry = this.bpmnModeler.get('elementRegistry')
        const eventTypes = ['element.click', 'element.changed','element.dblclick']
        eventTypes.forEach(function(eventType) {
          eventBus.on(eventType, function(e) {
            console.log(e)
            if (!e || e.element.type == 'bpmn:Process') return
            if (eventType === 'element.changed') {
              // that.elementChanged(e)
            }else if(eventType === 'element.dblclick'){
                console.log('aaaaaaaaaaaaaaaaaaa')
                return false
            } else if (eventType === 'element.click') {
              console.log('点击了element', e.element)
              var shape = e.element ? elementRegistry.get(e.element.id) : e.shape
              if (shape.type === 'bpmn:StartEvent') {
                modeling.updateProperties(shape, {
                  name: '我是修改后的虚线节点',
                  isInterrupting: false,
                  customText: '我是自定义的text属性'
                })
              }
            }
          })
        })
    }
    // 渲染 xml 格式
    renderDiagram = (bpmnModeler,xml) => {
        bpmnModeler.importXML(xml, err => {
            if (err) {
                notification.error({
                    message: '提示',
                    description: '导入失败',
                });
            }
        });
    };
    static contextType = WorkflowDesignContext;
    render() {
        return (

            <div style={{ minHeight: '100%', height: '100%' }} className={styles.container}>
                <div className={styles.container} style={  {minHeight:'100%',height:'100%'}} id="js-drop-zone">
                    <div className={styles.canvas} id="canvas"    style={{minHeight:'100%',height:'100%'}}/>


                    <div className={`properties-panel-parent showPanel`}
                    
                         id="properties-panel"
                            style={{height: '100%'}}
                    />
                </div>

              


            </div>

        )
    }
}
export default WorkflowDesign