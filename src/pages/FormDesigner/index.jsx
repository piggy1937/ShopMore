import React, {PureComponent} from 'react';
import {Layout, Button} from 'antd';
import FormDesigner from './FormDesigner';
import 'antd/dist/antd.css';
import FormStudio from "./utils/FormStudio";
import CreateModal from './CreateModal'

const {Header, Content} = Layout;

class Index extends PureComponent {
    constructor(props){
        super(props)
        this.state={
            modal:{
                isShowInfoModal: false,
                isShowCreateModal: false,
            }
        }
    }

    /**
     * 打开/关闭创建模态框
     */
    toggleShowCreateModal = (visible) => {
        this.setState({
            isShowCreateModal: visible,
        })
    }
    openCreateModal = () => {
        this.toggleShowCreateModal(true)
    }

    render() {
        const {isShowCreateModal} = this.state
        return (
            <Layout className="layout">
                <Header style={{background: 'white'}}>
                    <div className="logo"/>
                    <div  className="mini-panel-title">新建模板</div>
                    <div className="mini-panel-button">
                        <Button type="primary" onClick={()=>{this.props.history.push("/preview")}}>预览</Button>
                        <Button type="primary" onClick={()=>{this.openCreateModal()}}>保存数据</Button>
                        <Button type="primary" icon="undo" onClick={()=>{this.props.history.goBack()}}>返回</Button>
                    </div>
                </Header>
                <Content style={{padding: '50px 50px'}}>
                    <FormDesigner/>
                </Content>
                <CreateModal
                    visible={isShowCreateModal}
                    toggleVisible={this.toggleShowCreateModal}
                />
            </Layout>
        );
    }
}
export default Index

