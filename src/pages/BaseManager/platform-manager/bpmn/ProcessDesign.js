/*
 */
import React, {Component} from 'react';

import {Card, Form, Button, notification} from 'antd';

// Bpmn 相关文件
import propertiesPanelModule from 'bpmn-js-properties-panel';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import propertiesProviderModule from './BpmnEditor/Toolbar';
import EditingTools from './BpmnEditor/EditingTools';
import BpmnModeler from './BpmnEditor/Modeler';
@Form.create()
class ProcessDesign extends Component {
    state = {
        scale: 1, // 流程图比例
        svgVisible: false, // 预览图片
        svgSrc: '', // 图片地址
    };

   
       


   
    componentDidMount(){
        this.bpmnModeler = new BpmnModeler({
            container: '#canvas',
            propertiesPanel: {
                parent: '#properties-panel',
            },
            additionalModules: [propertiesPanelModule, propertiesProviderModule],
            moddleExtensions: {
                camunda: camundaModdleDescriptor,
            },
        });
       // this.renderDiagram(xml || diagramXML);
        // 删除 bpmn logo
        const bjsIoLogo = document.querySelector('.bjs-powered-by');
        while (bjsIoLogo.firstChild) {
            bjsIoLogo.removeChild(bjsIoLogo.firstChild);
        }
    }

    render() {
        const {loading} = this.props;
        const {hidePanel, hideFold, hideCount, svgVisible, svgSrc} = this.state;

        return (
            <div>
                <Card
                    bordered={false}
                    style={{width: '100%', height: '100%'}}
                    bodyStyle={{height: '100%'}}
                >
                    <div className={styles.container} id="js-drop-zone">
                        <div className={styles.canvas} id="canvas" />
                        <div
                            className={`properties-panel-fold
                                ${hideCount === 1 ? (hidePanel ? 'fold' : '') : ''}
                                ${hideCount === 1 ? (hideFold ? 'hide' : '') : ''}
                            `}
                            id="js-panel-fold"
                            title="折叠"
                            onClick={this.handlePanelFold}
                        />
                        <div
                            className={`properties-panel-parent ${
                                hideCount === 1 ? (hidePanel ? 'hidePanel' : 'showPanel') : ''
                            }`}
                            id="properties-panel"
                            style={{height: '100%'}}
                        />
                        <EditingTools
                            onOpenFIle={this.handleOpenFile}
                            // onSave={this.handleSave}
                            onUndo={this.handleUndo}
                            onRedo={this.handleRedo}
                            onDownloadSvg={this.handleDownloadSvg}
                            onDownloadXml={this.handleDownloadXml}
                            onZoomIn={() => this.handleZoom(0.1)}
                            onZoomOut={() => this.handleZoom(-0.1)}
                            onZoomReset={() => this.handleZoom()}
                            onPreview={this.handlePreview}
                        />
                    </div>
                </Card>

                {/* 查看流程图弹窗 */}
                {/* {svgVisible && (
                    <FullModal visible={svgVisible} onCancel={this.handleCancel}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: svgSrc,
                            }}
                        />
                    </FullModal> */}
                )}
             
            </div>
        );
    }
}

export default ProcessDesign;
