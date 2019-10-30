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
            message:""
        }
    }
    /***
     * 组织架构同步
     */
    syncInfo = async () => {
        let res
        try{
         res = await request({
            headers: {
                'content-type': 'application/json',
            },
            method: 'get',
            url: '/api/maycur/org/sync',
            data: {}
        })
    }catch(e){
        this.setState({
            isLoading: false,
        })
        return
    }
       this.setState({
           message:res.message
       })

    }
    render() {
        return (
            <div>
                <Card title="同步结果展示" extra={<div style={{ textAlign: 'left',marginRight: 0, width: '100%' }} wrapperCol={{ span: 48 }}>
                    <Button type='primary' onClick={this.syncInfo}>组织架构同步</Button>
                </div>}>
                   <span >{this.state.message}</span>
                </Card>
            </div>
        );
    }
}
export default SyncInfo