
import React  from 'react'
import {Form, message, Tabs} from 'antd'
import {tabContentMaps}  from './tabs'
import {fetchRoleType} from '@/store/actions'
import { withRouter } from 'react-router-dom'
import request  from '@/utils/request'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
const { TabPane } = Tabs;


@withRouter @Form.create()
class RoleManager extends React.Component{
    constructor(props){
        super(props)
        this.state={
            tabs:[]
        }
    }
   async componentDidMount() {
       try{
          const res = await request({
               headers: {
                   'content-type': 'application/json',
               },
               method: 'get',
               url: '/api/admin/role/type/all',
               data: {}
           })
           if (res.code===200) {
                this.setState({
                    tabs:res.result
                })
               return
           }
       }catch(e){
           message.error("获取角色类型异常")
           return
       }
   }
    render(){
        return(<div>
        <Tabs defaultActiveKey="1" >
            {
                this.state.tabs.map(e=>{
                    return ( <TabPane tab={e.name} key={e.code}>
                            {tabContentMaps[e.code]}
                    </TabPane>)
                })
            }
        </Tabs>
        </div>)
    }
}
export default RoleManager