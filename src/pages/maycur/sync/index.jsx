import React from 'react'
import { Table, Card, Form, Input, Button, DatePicker, message, Icon, Row, Col, Divider, Modal, Popconfirm, notification } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import request  from '@/utils/request'
import {CopyToClipboard} from 'react-copy-to-clipboard';
const store = connect(
    (state) => ({ user: state.user })
)
@withRouter @store @Form.create()
class SyncInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title:'结果展示',
            copied:false,
            message:'',
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
                title:'结果展示',
                copied:false,
                message:'',
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
                    title:'组织架构同步结果',
                    loading:{organization:true}
                })
                break
            case "subCompany" :
                this.setState({
                    title:'公司同步结果',
                    loading:{subCompany:true}
                })
                break
            case "department" :
                this.setState({
                    title:'部门同步结果',
                    loading:{department:true}
                })
                break
            case "resource" :
                this.setState({
                    title:'人员同步结果',
                    loading:{resource:true}
                })
                break
            case "role" :
                this.setState({
                    title:'角色同步结果',
                    loading:{role:true}
                })
                break
            case "costTracking" :
                this.setState({
                    title:'辅助核算同步结果',
                    loading:{costTracking:true}
                })
                break
            case "productFna" :
                this.setState({
                    title:'项目预算结果',
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
            message.error("同步异常")
        return
    }
    this.setState({
        message:res.message
    })
        switch (props){
            case "organization" :
                this.setState({
                    loading:{organization:false},
                })
                break
            case "subCompany" :
                this.setState({
                    loading:{subCompany:false},
                })
                break
            case "department" :
                this.setState({
                    loading:{department:false},
                })
                break
            case "resource" :
                this.setState({
                    loading:{resource:false},
                })
                break
            case "role" :
                this.setState({
                    loading:{role:false},
                })
                break
            case "costTracking" :
                this.setState({
                    loading:{costTracking:false},
                })
                break
            case "productFna" :
                this.setState({
                    loading:{productFna:false},
                })
                break
        }
    }
    render() {
        return (
            <div>
                <Card title={this.state.title}  extra={<div style={{ textAlign: 'left',marginRight: 0, width: '100%' }} wrapperCol={{ span: 48 }}>
                            <Button type='primary'  loading = {this.state.loading.organization}  onClick={()=> {this.syncInfo('organization')}}>组织架构同步</Button>&emsp;
                            <Button type='primary' loading = {this.state.loading.subCompany}  onClick={()=> {this.syncInfo('subCompany')}}>公司同步</Button>&emsp;
                            <Button type='primary' loading = {this.state.loading.department}  onClick={()=> {this.syncInfo('department')}}>部门同步</Button>&emsp;
                            <Button type='primary' loading = {this.state.loading.resource}  onClick={()=> {this.syncInfo('resource')}}>人员同步</Button>&emsp;
                            <Button type='primary' loading = {this.state.loading.role}  onClick={()=> {this.syncInfo('role')}}>角色同步</Button>&emsp;
                            <Button type='primary' loading = {this.state.loading.costTracking}  onClick={()=> {this.syncInfo('costTracking')}}>辅助核算同步</Button>&emsp;
                            <Button type='primary' loading = {this.state.loading.productFna}  onClick={()=> {this.syncInfo('productFna')}}>项目预算同步</Button>&emsp;
                            <Button icon="reload"  onClick={this.onReset}>重置</Button>
                </div>}>
                    <CopyToClipboard text={this.state.message}
                                     onCopy={() => this.setState({copied: true})}>
                        <button type='primary'>复制</button>
                    </CopyToClipboard><br/>
                    <textarea style={{marginTop: '1em'}} cols="120" rows="12"value={this.state.message}/>
                </Card>
            </div>
        );
    }
}
export default SyncInfo