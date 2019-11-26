import React, {PureComponent} from 'react';
import {Layout, Button,message} from 'antd';
import FormDesigner from './FormDesigner';
import 'antd/dist/antd.css';
import FormStudio from "./utils/FormStudio";
import CreateModal from './CreateModal'
import request from '@/utils/request'
import {withRouter} from 'react-router-dom'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeActiveMenu} from '@/store/actions'
const {Header, Content} = Layout;
const store = connect(
    (state) => ({
     }),
    (dispatch) => bindActionCreators({changeActiveMenu}, dispatch)
  )
/**表单设计 */
@withRouter
@store
class Index extends React.Component {
    constructor(props){
        super(props)
        this.state={
            modal:{
                isShowInfoModal: false,
                isShowCreateModal: false,

            },
            templateData:''

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
    componentDidMount(){
        //match.params.
        const {id} = this.props.match.params
        request({
            method:'get',
            url:`/api/admin/template/${id}`,
        }).then(data=>{
            if(data.code===200){
                this.setState({
                    templateData:data.result.template
                })
            }else{
                message.error(data.message)
            }
        }).catch(err=>{
            message.error(err.message)
        })

    }
    /**返回上级界面 */
    handleGoBack=()=>{
         this.props.changeActiveMenu({
             code:'templateManager',
             title:'模板管理'
         })
         this.props.history.goBack()
    }
    render() {
        const {isShowCreateModal,templateData} = this.state
        return (
            <Layout className="layout">
                <Header style={{background: 'white'}}>
                    <div className="logo"/>
                    <div  className="mini-panel-title">新建模板</div>
                    <div className="mini-panel-button">
                        <Button type="primary" onClick={()=>{this.props.history.push("/preview")}}>预览</Button>
                        <Button type="primary" onClick={()=>{this.openCreateModal()}}>保存数据</Button>
                        <Button type="primary" icon="undo" onClick={this.handleGoBack}>返回</Button>
                        <Button type="primary" icon="undo" onClick={()=>{this.props.history.goBack()}}>从数据库选择</Button>
                    </div>
                </Header>
                <Content style={{padding: '50px 50px'}}>
                    <FormDesigner templateData={templateData}/>
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

