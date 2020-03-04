import React from 'react';
import { FactoryRegister} from '../warpper';
import { sortable } from '../lib/sortable';
import FormStudio from '../utils/FormStudio';
import { Layout } from '../component';
import LayoutWrapper from './LayoutWrapper';
import { Map } from 'immutable';
import {Row} from 'antd'
import {ColumnLayoutProvider,ColumnLayoutConsumer} from './ColumnLayoutProvider'
/**
 * 这是一个特殊的布局
 */
@LayoutWrapper({focusAble: false, toolbarAble: false, layoutStyle:{
    display:'flex',
    position:'relative',
    width:'100%',
    minHeight:'50px',
  }})
class LinearLayout extends Layout{
 constructor(props){
   super(props)
   this.ref= React.createRef()
 }
  componentDidMount(){
    sortable(this.ref.current, this);
  }

  

  renderChildren(){
    const {definition:{children}} = this.props;
    return children.map(item=>{
      return FormStudio.getFactory(item.type).renderComponenet(item)();
    });
  }

  render (){
    return (
          <div className={['ui-sortable','ant-row'].join(' ')} ref={this.ref}>
             {this.renderChildren()}
          </div>
    )
  }
}

@FactoryRegister(LinearLayout)
class LinearLayoutFactory extends React.Component{
  
  constructor(props){
    super(props);
    this.type="LinearLayout"
    this.title="流式布局"
    this.children=[]
    this.state={
      span:12
    }
  }
  changeSpan=(span)=>{
    console.log('changeSpan',span)
    this.setState({
      span
    })
  }
  /**
   * 初始化一个组件定义
   * @returns {{type: string, title: string}}
   */
  createComponentDefinition(props){
    let map =Map( {
      type: this.type,
      title: this.title,
      span:this.state.span,
      props:{ },
      children:this.children,
      changeSpan:this.changeSpan
    })
   
    if(props&&Object.keys(props).length!=0){
      console.log(props)
      let jobj 
      try{
      let jobj = JSON.parse(props)
       map= map.set('type',jobj.type)
       map= map.set('title',jobj.title)
       map= map.set('span',jobj.span)
       map= map.set('props',jobj.props)
       map= map.set('changeSpan',jobj.changeSpan)
       map= map.set('children',jobj.children)
      }catch(e){
        console.log(e)
      }
    }
    return map.toJS()
  }
  initChildren(){
     this.children=[]
  }
 
}

export default LinearLayoutFactory;

