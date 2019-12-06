import React, {PureComponent} from 'react';
import { Form, InputNumber,Col,Button,Icon,Card } from 'antd';
import { ComponentEditor, FactoryRegister } from '../warpper';
import { Layout } from '../component';
import { guaranteeNumber } from '../utils/MiscUtil';
import LayoutWrapper from './LayoutWrapper';
import FormStudio from "../utils/FormStudio";
import {Map,List} from 'immutable'
const LinearLayoutFactory = FormStudio.getFactory("LinearLayout");

@LayoutWrapper()
class ColumnLayout extends Layout{

  renderColumns(){
    const {definition:{children, props:{columnNum}}}= this.props;

    let es = columnNum -children.length;
    if(es !== 0){
      if(es<0){
        es = Math.abs(es);
        children.splice(children.length-es, es);
      }else{
        while(es!==0){
          children.splice(children.length, 0, LinearLayoutFactory.createComponentDefinition());
          es-=1;
        }
      }
    }

    return children.map(item =>{
      return (
        <Col className="cell" span={item.span}>
          {LinearLayoutFactory.renderComponenet(item)()}
        </Col>)
    })

  }

  render (){
    return (
      <div style={{width:'100%',margin:'4px',display:'box'}} className={["column-layout",'ant-row'].join(' ')}>{this.renderColumns()}</div>
    )
  }
}

@ComponentEditor
class ColumnComponentEditor extends PureComponent{
  constructor(props){
    super(props)
    this.state={
     changeFlag:false
    }
  }
 
  onChange(_, allValues){
    const { definition:{props} } = this.props;
    Object.assign(props, allValues);
    props.columnNum = guaranteeNumber(props.columnNum, 0, 24);
    
  }
  /**
   * 展示列配置项
   */
  renderColumnConfig=()=>{
    const { form:{getFieldDecorator,setFieldsValue}, definition:{children,props} } = this.props;
    console.log(children)
   let html= children.map((e,index)=>(
       
        <Form.Item >
        
            <InputNumber key={index} min={1} max={24} defaultValue={12}  onChange={(v)=>{
              e.span = v
              let key = `column_${index}`
              setFieldsValue({
                key:v
              })
            }} />
        </Form.Item>  
        
   ))
    console.log(children)
   return html
  }
  /***
   * 新增一列
   */
  handleAdd=()=>{
    const { form:{getFieldDecorator,setFieldsValue}, definition:{children,props} } = this.props;
      let bak = List(children)
      bak =bak.push( LinearLayoutFactory.createComponentDefinition())
      children=bak.toJS()    

  }
  render(){
    const { form:{getFieldDecorator}, definition:{props} } = this.props;
    return (
      <Form >
         <Card title="列项配置">
          {this.renderColumnConfig()}
        </Card>
        <Form.Item style={{margin:0}} >
          <Button type="dashed" onClick={this.handleAdd} style={{ width: '60%' }}>
            <Icon type="plus" /> 新增列
          </Button>
        </Form.Item>
      </Form>);
  }
}

@FactoryRegister(ColumnLayout, ColumnComponentEditor)
class ColumnLayoutFactory{
  type="ColumnLayout"

  title="列布局"
  icon="iconfont icon-dingshi"
  category="advance"
  index = 0
  /**
   * 初始化一个组件定义
   * @returns {{type: string, title: string}}
   */
  createComponentDefinition(){
    let map = Map({
      type: this.type,
      title: this.title,
      props:{
        'columnNum':2
      },
      children:[
      ]
    });
    let children = List()
    this.index +=1;
    children = children.push( LinearLayoutFactory.createComponentDefinition({key:this.index}));
    this.index +=1;
    children = children.push( LinearLayoutFactory.createComponentDefinition({key:this.index}));
    map = map.setIn(['props','children'],children)
    return map.toJS();
  }
}


export default ColumnLayoutFactory;

