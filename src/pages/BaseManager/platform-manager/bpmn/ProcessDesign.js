/*
 */
import React, {Component} from 'react';

import {Card, Form, Button, notification} from 'antd';

// Bpmn 相关文件
import propertiesPanelModule from 'cus-bpmn-js-properties-panel';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import propertiesProviderModule from './BpmnEditor/Toolbar';
import EditingTools from './BpmnEditor/EditingTools';
import BpmnModeler from './BpmnEditor/Modeler';
import {diagramXML} from './BpmnEditor/sources/xml';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import styles from './BpmnEditor/sources/Bpmn.module.less';
import {ProcessDesignContext} from '../model/ProcessDesignProvider'
@Form.create()
class ProcessDesign extends Component {
    state = {
        scale: 1, // 流程图比例
        svgVisible: false, // 预览图片
        svgSrc: '', // 图片地址
    };





    // key value 转换
    translateData(data, name = 'label', value = 'value') {
        if (!data) return;

        return data.map(item => {
            return {
                name: item[name],
                value: item[value],
            };
        });
    }

    /**
     * 下载xml/svg
     *  @param  type  类型  svg / xml
     *  @param  data  数据
     *  @param  name  文件名称
     */
    download = (type, data, name) => {
        let dataTrack = '';
        const a = document.createElement('a');

        switch (type) {
            case 'xml':
                dataTrack = 'bpmn';
                break;
            case 'svg':
                dataTrack = 'svg';
                break;
            default:
                break;
        }

        name = name || `diagram.${dataTrack}`;

        a.setAttribute(
            'href',
            `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`
        );
        a.setAttribute('target', '_blank');
        a.setAttribute('dataTrack', `diagram:download-${dataTrack}`);
        a.setAttribute('download', name);

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // 导入 xml 文件
    handleOpenFile = e => {
        const that = this;
        const file = e.target.files[0];
        const reader = new FileReader();
        let data = '';
        reader.readAsText(file);
        reader.onload = function(event) {
            data = event.target.result;
            that.renderDiagram(data, 'open');
        };
    };


    // 前进
    handleRedo = () => {
        this.bpmnModeler.get('commandStack').redo();
    };

    // 后退
    handleUndo = () => {
        this.bpmnModeler.get('commandStack').undo();
    };

    // 下载 SVG 格式
    handleDownloadSvg = () => {
        this.bpmnModeler.saveSVG({format: true}, (err, data) => {
            this.download('svg', data);
        });
    };

    // 下载 XML 格式
    handleDownloadXml = () => {
        this.bpmnModeler.saveXML({format: true}, (err, data) => {
            this.download('xml', data);
        });
    };

    // 流程图放大缩小
    handleZoom = radio => {
        const newScale = !radio
            ? 1.0 // 不输入radio则还原
            : this.state.scale + radio <= 0.2 // 最小缩小倍数
            ? 0.2
            : this.state.scale + radio;

        this.bpmnModeler.get('canvas').zoom(newScale);
        this.setState({
            scale: newScale,
        });
    };

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

    // 预览图片
    handlePreview = () => {
        this.bpmnModeler.saveSVG({format: true}, (err, data) => {
            this.setState({
                svgSrc: data,
                svgVisible: true,
            });
        });
    };

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

    // 返回列表
    handleBack() {
       // router.push('/bpmn/processManage');
    }

    // 关闭流程图弹窗
    handleCancel = () => {
        this.setState({
            svgSrc: '',
            svgVisible: false,
        });
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
        this.renderDiagram(bpmnModeler,contect.initXML?contect.initXML:diagramXML);
        contect.initBpmnModeler(bpmnModeler)
    }
    static contextType = ProcessDesignContext;
    render() {

        const {loading} = this.props;
        const {hidePanel, hideFold, hideCount, svgVisible, svgSrc} = this.state;

        return (
            <div style={{minHeight:'100%',height:'100%'}} className={styles.container}>

                    <div className={styles.container} style={  {minHeight:'100%',height:'100%'}} id="js-drop-zone">
                        <div className={styles.canvas} id="canvas"  style={{minHeight:'100%',height:'100%'}}/>
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


                {/* 查看流程图弹窗 */}
                {/* {svgVisible && (
                    <FullModal visible={svgVisible} onCancel={this.handleCancel}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: svgSrc,
                            }}
                        />
                    </FullModal> */}

            </div>
        );
    }
}

export default ProcessDesign;
