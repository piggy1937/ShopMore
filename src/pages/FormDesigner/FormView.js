import React, {PureComponent} from 'react'
import FormStudio from './utils/FormStudio';
import { Map } from 'immutable';
require('./formView.less');

class FormView extends PureComponent{
  static defaultProps={
    formDefinition:{}
  }
  constructor(props){
    super(props)
    this.state={
      templateData:''
    }
  }
    /***
     * view 将要加载时设置row
     */
    componentWillMount(){
      const LinearLayoutFactory =FormStudio.getFactory("LinearLayout");
      //初始化子类
      LinearLayoutFactory.initChildren();
      this.LinearLayout = LinearLayoutFactory.renderComponenet( LinearLayoutFactory.createComponentDefinition())({
      });
      FormStudio.topLayout = this.LinearLayout;
    }

 

  render() {
     const { formDefinition } = this.props;
     const LinearLayoutFactory =FormStudio.getFactory("LinearLayout");
     let tmp  =LinearLayoutFactory.createComponentDefinition(formDefinition);
     let result=  LinearLayoutFactory.renderComponenet(tmp)({
     
     });
     FormStudio.topLayout = result;
    return (
      <div style={{width: formDefinition.width || '1000px'}}>
        <div className="scroll-wrapper">
          <div className="form-view">
            <div className="form-head">
              <p className="form-name" />
              <div className="form-description">{formDefinition.description||''}</div>
            </div>
            <div
              className="form-content"
            >
              {
                result
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FormView;
