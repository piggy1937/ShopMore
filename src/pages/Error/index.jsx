import React from 'react';
import { Result, Button } from 'antd';
import { withRouter } from 'react-router-dom'
@withRouter
class Error extends React.Component{
    render(){
        return (<div><Result
            status="500"
            title="500"
            subTitle="Sorry, the server is wrong."
            extra={<Button type="primary" onClick={()=>{this.props.history.push('/')}}>Back Home</Button>}
          /></div>)
    }
}
export default Error;