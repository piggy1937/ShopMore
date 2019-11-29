import  React from 'react'
import Draggable,{DraggableCore} from 'react-draggable';
import {Modal,Row,Col} from 'antd'
import DragM from 'dragm';
class ModalTitle extends React.Component {
    updateTransform = transformStr => {
      this.modalDom.style.transform = transformStr;
    };
    componentDidMount() {
      this.modalDom = document.getElementsByClassName(
        "ant-modal-wrap" //modal的class是ant-modal-wrap
      )[0];
    }
    render() {
      const { title } = this.props;
      return (
          <div>
            <DragM updateTransform={this.updateTransform}>
            <span style={{width:'90%',display:'inline-block'}}>{title} </span>
            </DragM>
            <span style={{float:'right',paddingRight:'30px',display:'inline-block'}} onClick={()=>{
                console.log('11111')
            }}> <i className="iconfont icon-quanping"></i></span>
        </div>
       
      );
    }
}
class CustomizeModel extends React.Component{
    render() {
        const title = <ModalTitle title={this.props.title} />;
        return (
                <Modal
                    {...this.props}
                    title={title}
                    >
                    {this.props.children}
                </Modal>
        );
      }
}
export default CustomizeModel