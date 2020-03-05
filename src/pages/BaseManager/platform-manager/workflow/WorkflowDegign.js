import React, { Component } from 'react';
import styles from './WorkflowEditor/workflow.module.less';
import BpmnModeler from './WorkflowEditor/modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import {WorkflowDesignContext} from './WorkflowDesignProvider'
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
            container: '#canvas'
        });
        this.renderDiagram(bpmnModeler,contect.initXML);
        contect.initBpmnModeler(bpmnModeler)
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
                    <div className={styles.canvas} id="canvas"  style={{minHeight:'100%',height:'100%'}}/>
                </div>
            </div>

        )
    }
}
export default WorkflowDesign