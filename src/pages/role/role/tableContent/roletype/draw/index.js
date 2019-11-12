import React  from 'react';
import { Drawer, Button,Row,Col } from 'antd';
class CreateDraw extends React.Component{
    handleClose = () => {
        this.props.toggleVisible(false)
    }
    render() {
        const { visible , title } = this.props
        return (
          <div>
        
            <Drawer
              title={title}
              placement="right"
              closable={false}
              onClose={this.handleClose}
              width={'60%'}
              visible={visible}
            >
             <div>
                 
             
             <Row>
                <Col span={8}>col-8</Col>
                <Col span={16} offset={8}>
                    col-8
                </Col>
            </Row>             
             
             
             
             
             </div> 



            <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={this.handleClose} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={this.onClose} type="primary">
              确认
            </Button>
          </div>
            </Drawer>
          </div>
        );
      }
}


export default CreateDraw;