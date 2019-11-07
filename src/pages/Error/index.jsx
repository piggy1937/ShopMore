import React from 'react'
import { Result, Button } from 'antd';
import { withRouter } from 'react-router-dom'
@withRouter
class Error extends React.Component{
    render(){
        return (
            <Result
                status="500"
                title="500"
                subTitle="对不起，网络出现故障！"
                extra={<Button type="primary" onClick={()=>{this.props.history.push('/')}}>回到首页</Button>}
            />
        )
    }
}
export default Error;