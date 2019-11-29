import  React from 'react'
import Draggable,{DraggableCore} from 'react-draggable';
import {Modal,Row,Col} from 'antd'
import DragM from 'dragm';
import Styles from './model.module.less'
import {judgeIsSupportFull,fullScreen,fullExit} from './utils'
class ModalTitle extends React.Component {
    constructor(props){
        super(props)
        this.state={
            isSupportFull:false,
            isFull:false
        }
    }
    updateTransform = transformStr => {
      this.modalDom.style.transform = transformStr;
    };
    componentDidMount() {
      this.modalDom = document.getElementsByClassName(
        "ant-modal-wrap" //modal的class是ant-modal-wrap
      )[0];
      window.addEventListener("resize", this.changeFullStatus);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.changeFullStatus);
      }
    // 判断当前浏览器是否支持全屏API
  judgeIsSupportFull = () => {
    let isSupportFull = judgeIsSupportFull();
    this.setState({ isSupportFull });
  };
  // 计算当前是否处于全屏
  changeFullStatus = () => {
      if(this.state.isFull){
        this.setState({ isFull: true });
      }else{
        this.setState({ isFull: false });
      }
    // this.setState({
    //     isFull:!this.state.isFull
    // })
    // 判断网页的高度或者宽度是否等于屏幕对应大小
    // true: 当前处于全屏状态
    // false: 当前不处于全屏状态
    // let element = document.getElementsByClassName(
    //     "ant-modal-wrap" //modal的class是ant-modal-wrap
    //   )[0]
    // console.log(document.body.scrollHeight,window.screen.height)
    // if (
    //     document.body.scrollHeight === window.screen.height ||
    //     document.body.scrollWidth === window.screen.width
    // ) {
    //   this.setState({ isFull: true });
    // } else {
    //   this.setState({ isFull: false });
    // }
  };
    render() {
      const { title } = this.props;
      return (
          <div>
            <DragM updateTransform={this.updateTransform}>
            <span style={{width:'90%',display:'inline-block'}}>{title} </span>
            </DragM>
           
            <span style={{float:'right',paddingRight:'30px',display:'inline-block'}} onClick={()=>{
                this.state.isFull ? fullExit() : fullScreen();
                
            }}> <i className={`iconfont icon-quanping ${Styles.quanping}`} ></i></span>
             <span  style={{float:'right',paddingRight:'10px',display:'inline-block'}} onClick={()=>fullExit()}><i className={`iconfont icon-zuixiaohua ${Styles.quanping}`} ></i></span>
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