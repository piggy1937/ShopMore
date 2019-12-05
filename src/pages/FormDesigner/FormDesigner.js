import React, {PureComponent} from 'react'
import {Tabs, Card} from 'antd';
import $ from './lib/jquery';
import FormView from './FormView';
import componentStyle from './component.less';
import './FormDesigner.less'
import FormStudio from './utils/FormStudio';
import PropsEditor from  './PropsEditor';

require('./components');

require('./layout');

const TabPane = Tabs.TabPane;

class FormComponent extends PureComponent{
  ref= (node)=>{
    this.node = node;
  }

  componentDidMount(){
    const { component } = this.props;
    $(this.node).draggable({
      connectToSortable: ".ui-sortable",
      helper: "clone",
      opacity: .8,
      appendTo: "body",
      start() {
        FormStudio.draggedFactory = component;
      },
      stop(){
        FormStudio.draggedFactory = null;
      }
    }).disableSelection();
  }

  render(){
    const {component, onMouseDown, onMouseUp} = this.props;
    return (
      <li
      
        draggable
        className={[componentStyle.widgetItem,'form-edit-widget-label'].join(" ")}
        onMouseDown={()=>onMouseDown(component.type)}
        onMouseUp={()=>onMouseUp(component.type)}
        ref={this.ref}
        key={component.type}
      >
        <i className={component.icon}></i>{component.title}
      </li>
    )
  }
}



class FormDesigner extends PureComponent {

  componentDidMount(){

  }

  onMouseDown = (componentType)=>{
    this.setState({dragVisible:true});
    console.log(componentType);
  }

  onMouseUp = (componentType)=>{
    // this.setState({dragVisible:false});
    console.log(componentType);
  }


  renderChild(){
    return (
      <div className="components-list">
         <div className="widget-cate">基础组件</div>
          <ul >
            {
              FormStudio.factoryFilter(item=>{
              let flag = false
              flag =(item.type !== 'LinearLayout'&&item.category==='basic')
                
               return flag
              }).map(item=>{
              return <FormComponent component={item} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} key={item.type}/>
              })
           }
          
          </ul>
         <div className="widget-cate">布局字段</div>
          <ul >
            {
              FormStudio.factoryFilter(item=>{
              let flag = false
              flag =(item.category==='advance')
                
               return flag
              }).map(item=>{
              return <FormComponent component={item} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} key={item.type}/>
              })
           }
          
          </ul>

      </div>



    )
   


     


    return 
  }

  render() {
    return (
      <div className="form-designer">
            <div className={componentStyle.widgetList}  style={{width:'200px'}}>
                {this.renderChild()}
            </div>
        <div>
          <FormView formDefinition={{templateData:this.props.templateData}} />
        </div>

        <Card bordered style={{flexGrow:1}} type="card" title="属性编辑">
          <PropsEditor />
        </Card>
      </div>
    );
  }
}

export default FormDesigner;
