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
                    <Button type="primary" icon="undo" onClick={()=>{this.props.history.push('/')}}>返回</Button>
                    <Button type="primary" onClick={()=>{this.getJsonData()}}>保存数据</Button>
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

