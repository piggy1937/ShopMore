import React from 'react'
import { Table, Card, Form, Input, Button, DatePicker, message, Icon, Row, Col, Divider, Modal, Popconfirm, notification } from 'antd'
import { withRouter } from 'react-router-dom'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import { connect } from 'react-redux'
import request  from '@/utils/request'
import ReactJson from 'react-json-view'
const store = connect(
     (state) => ({ user: state.user })
)
@withRouter @store @Form.create()
class SyncInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title:'结果展示',
            message:'',
            modifyError:{},
            modifySuccess:{},
            deleteError:{},
            deleteSuccess:{},
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

    onCopy=()=>{
        if(this.state.message!=''){
            message.success("复制成功")
        }
    }
    onReset = ()=>{
        this.setState({
                title:'结果展示',
                message:'',
                modifyError:{},
                modifySuccess:{},
                deleteError:{},
                deleteSuccess:{},
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
        this.onReset()
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

       if(res.result){
           const ret = res.result[0]
        let modifyError={}
        let modifySuccess = {}
        let deleteError = {}
        let deleteSuccess = {}
        if(ret instanceof Object){
            ret.forEach(e=>{
                if(e.modifyError){
                    modifyError=e.modifyError
                    console.log(modifyError)
                }
                if(e.modifySuccess){
                    modifySuccess=e.modifySuccess
                }
                if(e.deleteError){
                    deleteError=e.deleteError;
                }
                if(e.deleteSuccess){
                    deleteSuccess = e.deleteSuccess;
                }
            })
            console.log( modifyError,
                modifySuccess,
                deleteError,
                deleteSuccess,)
            this.setState({
                modifyError,
                modifySuccess,
                deleteError,
                deleteSuccess,
                loading:false
            })
        }else{
            this.setState({
                message:ret,
                loading:false
            })
        }

       }else{
           this.setState({
               message:res.message,
               loading:false
           })
       }

    }
    render() {
        return (
            <div>
                <Card title={this.state.title}  extra={<div style={{ textAlign: 'left',marginRight: 0, width: '100%' }}>
                            <Button type='primary'  loading = {this.state.loading.organization}  onClick={()=> {this.syncInfo('organization')}}>组织架构同步</Button>&emsp;
                            <Button type='primary' loading = {this.state.loading.subCompany}  onClick={()=> {this.syncInfo('subCompany')}}>公司同步</Button>&emsp;
                            <Button type='primary' loading = {this.state.loading.department}  onClick={()=> {this.syncInfo('department')}}>部门同步</Button>&emsp;
                            <Button type='primary' loading = {this.state.loading.resource}  onClick={()=> {this.syncInfo('resource')}}>人员同步</Button>&emsp;
                            <Button type='primary' loading = {this.state.loading.role}  onClick={()=> {this.syncInfo('role')}}>角色同步</Button>&emsp;
                            <Button type='primary' loading = {this.state.loading.costTracking}  onClick={()=> {this.syncInfo('costTracking')}}>辅助核算同步</Button>&emsp;
                            <Button type='primary' loading = {this.state.loading.productFna}  onClick={()=> {this.syncInfo('productFna')}}>项目预算同步</Button>&emsp;
                            <Button icon="reload"  onClick={this.onReset}>重置</Button>
                </div>}>
                    <div style={{ background: '#ECECEC', padding: '30px' }}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Card title="成功数据" bordered={false}>
                                    <ReactJson src={this.state.deleteSuccess} name = {"删除数据"} collapsed={4}/>
                                    <ReactJson src={this.state.modifySuccess} name = {"修改数据"} collapsed={4}/>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="失败数据" bordered={false}>
                                    <ReactJson src={this.state.deleteError} name = {"删除失败"} collapsed={4}/>
                                    <ReactJson src={this.state.modifyError} name = {"修改失败"} collapsed={4}/>
                                </Card>
                            </Col>
                        </Row><br/>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Card title="其他信息" bordered={false}>
                                    <CopyToClipboard text={this.state.message}
                                                     onCopy={this.onCopy}>
                                        <button type='primary'>复制</button>
                                    </CopyToClipboard><br/>
                                    <textarea  cols="60" rows="5"  defaultValue={this.state.message} ></textarea>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </div>
        );
    }
}
export default SyncInfo