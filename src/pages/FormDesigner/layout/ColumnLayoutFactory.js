import React, {PureComponent} from 'react';
import { Form, InputNumber,Input  } from 'antd';
import { ComponentEditor, FactoryRegister } from '../warpper';
import { Layout } from '../component';
import { guaranteeNumber } from '../utils/MiscUtil';
import LayoutWrapper from './LayoutWrapper';
import FormStudio from "../utils/FormStudio";

const LinearLayoutFactory = FormStudio.getFactory("LinearLayout");

@LayoutWrapper()
class ColumnLayout extends Layout{

  renderColumns(){
    const {definition:{children, props:{columnNum,gutter}}}= this.props;

    let es = columnNum -children.length;
    if(es !== 0){
      if(es<0){
        es = Math.abs(es);
        children.splice(children.length-es, es);
      }else{
        while(es!==0){
         const obj = {...LinearLayoutFactory.createComponentDefinition(),gutter}
          children.splice(children.length, 0, obj);
          es-=1;
        }
      }
    }

    return children.map(item =>{
      const obj = {...item,gutter}
      return (
        <div className="cell">
          {LinearLayoutFactory.renderComponenet(obj)()}
        </div>)
    })

  }

  render (){
    return (
      <div className="column-layout">{this.renderColumns()}</div>
    )
  }
}

@ComponentEditor
class ColumnComponentEditor extends PureComponent{

  onChange(_, allValues){
    const { definition:{props} } = this.props;
    Object.assign(props, allValues);
    props.columnNum = guaranteeNumber(props.columnNum, 0, 10);
  }

  render(){
    const { form:{getFieldDecorator}, definition:{props} } = this.props;
    return (
      <Form>
        <Form.Item label="列数目" style={{ marginBottom:0 }}>
          {getFieldDecorator('columnNum',{
            initialValue: props.columnNum,
              rules:[{
                  type:'number',
                  min:1,
                  message:'不得小于1'
              },{
              type:'number',
              max:10,
              message:'不得大于10'
          }]
          })(<InputNumber />)}
        </Form.Item>
        <Form.Item label="栅格间隔" style={{ marginBottom:0 }}>
          {getFieldDecorator('gutter',{
            initialValue: props.gutter
          })(<Input placeholder='可以输入数字|字符串'/>)}
        </Form.Item>
      </Form>);
  }
}

@FactoryRegister(ColumnLayout, ColumnComponentEditor)
class ColumnLayoutFactory{
  type="ColumnLayout"
  title="栅格布局"
  icon="iconfont icon-iconfonttubiao_zhageshuju"
  category="advance"
  /**
   * 初始化一个组件定义
   * @returns {{type: string, title: string}}
   */
  createComponentDefinition(){
    return {
      type: this.type,
      title: this.title,
      props:{
        'gutter':'0',
        'columnNum':2
      },
      children:[
        LinearLayoutFactory.createComponentDefinition(),
        LinearLayoutFactory.createComponentDefinition()
      ]
    }
  }
}


export default ColumnLayoutFactory;

