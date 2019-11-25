import React, {Component} from "react"
import {Button, Layout} from 'antd';
import FormStudio from "../utils/FormStudio";
import { FactoryRegister} from '../warpper';

const { Header, Sider, Content } = Layout;
require('../formView.less');
class index extends Component {
    componentWillMount(){
        this.LinearLayout=  FormStudio._topLayout
    }

    render() {

        return (
            <div style={{padding: '20px 50px',width:'778px',allowResize:"true" ,showToolbar:"true"}} className='mini-panel-header'>
                <Header style={{background: 'white'}}>
                    <div className="logo">
                        <div  className="mini-panel-title">预览</div>
                        <div className="mini-panel-button">
                            <Button type="primary" icon="undo" onClick={()=>{this.props.history.goBack()}}>返回</Button>
                        </div>
                    </div>
                </Header>
                <Content style={{padding: '20px 50px',width:'778px'}}>
                    <div className="scroll-wrapper">
                        <div className="form-view">
                            <div className="form-head">
                                <p className="form-name" />
                                <div className="form-description"></div>
                            </div>
                            <div
                                className="form-content"
                            >
                                {this.LinearLayout}
                            </div>
                        </div>
                    </div>
                </Content>
            </div>
        );
    }
}

export default index;