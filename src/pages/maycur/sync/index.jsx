import React from 'react'
import { Table, Card, Form, Input, Button, DatePicker, message, Icon, Row, Col, Divider, Modal, Popconfirm, notification } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import request  from '@/utils/request'
const store = connect(
    (state) => ({ user: state.user })
)
@withRouter @store @Form.create()
class SyncInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            message:{
                subCompany:"",
                organization:"",
                department:"",
                resource:"",
                role:"",
                costTracking:"",
                productFna:""
            },
            loading:{
                subCompany:false,
                organization:false,
                department:false,
                resource:false,
                role:false,
                costTracking:false,
                productFna:false
            }
    }
    }
    onReset = ()=>{
        this.setState({
                message:{
                    subCompany:"",
                    organization:"",
                    department:"",
                    resource:"",
                    role:"",
                    costTracking:"",
                    productFna:""
                },
                loading:{
                    subCompany:false,
                    organization:false,
                    department:false,
                    resource:false,
                    role:false,
                    costTracking:false,
                    productFna:false
                }
        })
    }
    /***
     * 组织架构同步
     */
    syncInfo = async (props) => {
        switch (props){
            case "organization" :
                this.setState({
                    loading:{organization:true}
                })
                break
            case "subCompany" :
                this.setState({
                    loading:{subCompany:true}
                })
                break
            case "department" :
                this.setState({
                    loading:{department:true}
                })
                break
            case "resource" :
                this.setState({
                    loading:{resource:true}
                })
                break
            case "role" :
                this.setState({
                    loading:{role:true}
                })
                break
            case "costTracking" :
                this.setState({
                    loading:{costTracking:true}
                })
                break
            case "productFna" :
                this.setState({
                    loading:{productFna:true}
                })
                break
        }
        let res
        try{
         res = await request({
            headers: {
                'content-type': 'application/json',
            },
            method: 'get',
            url: '/api/maycur/org/sync',
            data: {
                unit:props
         }
        })
    }catch(e){
            message.error("前端同步异常")
        return
    }
        switch (props){
            case "organization" :
                this.setState({
                    loading:{organization:false},
                    message:{organization :res.message}
                })
                break
            case "subCompany" :
                this.setState({
                    loading:{subCompany:false},
                    message:{subCompany :res.message}

                })
                break
            case "department" :
                this.setState({
                    loading:{department:false},
                    message:{department :res.message}
                })
                break
            case "resource" :
                this.setState({
                    loading:{resource:false},
                    message:{resource :res.message}
                })
                break
            case "role" :
                this.setState({
                    loading:{role:false},
                    message:{role :res.message}
                })
                break
            case "costTracking" :
                this.setState({
                    loading:{costTracking:false},
                    message:{costTracking :res.message}
                })
                break
            case "productFna" :
                this.setState({
                    loading:{productFna:false},
                    message:{productFna :res.message}
                })
                break
        }
    }
    render() {
        return (
            <div>
                <Card title="同步结果展示" extra={<div style={{ textAlign: 'left',marginRight: 0, width: '100%' }} wrapperCol={{ span: 48 }}>
                            <Button type='primary'  loading = {this.state.loading.organization}  onClick={()=> {this.syncInfo('organization')}}>组织架构同步</Button>&emsp;
                            <Button type='primary' loading = {this.state.loading.subCompany}  onClick={()=> {this.syncInfo('subCompany')}}>公司同步</Button>&emsp;
                            <Button type='primary' loading = {this.state.loading.department}  onClick={()=> {this.syncInfo('department')}}>部门同步</Button>&emsp;
                            <Button type='primary' loading = {this.state.loading.resource}  onClick={()=> {this.syncInfo('resource')}}>人员同步</Button>&emsp;
                            <Button type='primary' loading = {this.state.loading.role}  onClick={()=> {this.syncInfo('role')}}>角色同步</Button>&emsp;
                            <Button type='primary' loading = {this.state.loading.costTracking}  onClick={()=> {this.syncInfo('costTracking')}}>辅助核算同步</Button>&emsp;
                            <Button type='primary' loading = {this.state.loading.productFna}  onClick={()=> {this.syncInfo('productFna')}}>项目预算同步</Button>&emsp;
                            <Button icon="reload"  onClick={this.onReset}>重置</Button>
                </div>}>
                    <div>组织架构同步：{this.state.message.organization}</div><br/>
                    <div>公司同步：{this.state.message.subCompany}</div><br/>
                    <div>部门同步：{this.state.message.department}</div><br/>
                    <div>人员同步：{this.state.message.resource}</div><br/>
                    <div>角色同步：{this.state.message.role}</div><br/>
                    <div>辅助核算同步：{this.state.message.costTracking}</div><br/>
                    <div>项目预算同步：{this.state.message.productFna}</div><br/>
                </Card>
            </div>
        );
    }
}
export default SyncInfo