import React from 'react';
import { Result, Button } from 'antd';
import { withRouter } from 'react-router-dom'
import FormBuilder  from './index.jsx'
@withRouter
class Error extends React.Component{
    render(){
        return (
            <FormBuilder.ReactFormBuilder />
        )
    }
}
export default Error;