import React  from 'react'
import { Tabs } from 'antd';
import {tabContentMaps}  from './tabs'
const { TabPane } = Tabs;
class RoleManager extends React.Component{
    constructor(props){
        super(props)
        this.state={
            tabs:[{
              title:'角色类型',
              key:'roleType'
            },{
                title:'部门类型',
                key:'departmentType'
            }]
        }
    }
    render(){
        return (<div>


        <Tabs defaultActiveKey="1" >
            {
                this.state.tabs.map(e=>{
                    return ( <TabPane tab={e.title} key={e.key}>
                            {tabContentMaps[e.key]}
                    </TabPane>)
                })


            }
        </Tabs>

        </div>)
    }
}
export default RoleManager