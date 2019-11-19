import React, {PureComponent} from 'react';
import {Layout, Button} from 'antd';
import {render} from 'react-dom';
import FormDesigner from './FormDesigner';
import 'antd/dist/antd.css';
import FormStudio from "./utils/FormStudio";  // or 'antd/dist/antd.less'

const {Header, Content} = Layout;

class Index extends PureComponent {
    getJsonData() {
        alert(JSON.stringify(FormStudio.getJsonData()));
    }

    render() {
        return (
            <Layout className="layout">
                <Header style={{background: 'white'}}>
                    <div className="logo"/>
                    <Button type="primary" onClick={this.getJsonData}>获取数据</Button>
                </Header>
                <Content style={{padding: '50px 50px'}}>
                    <FormDesigner/>
                </Content>
            </Layout>
        );
    }
}
export default Index

