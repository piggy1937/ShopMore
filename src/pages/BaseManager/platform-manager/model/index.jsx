import React,{createContext} from 'react'
import {
    Table,
    Card,
    Form,
    Input,
    Button,
    Row,
    Col,
    Popconfirm,
    Pagination, 
} from 'antd'
import request from '@/utils/request'
import {withRouter} from 'react-router-dom'
import CreateFlowModal from './createFlowModal'
import CreateProcessDesignModal from './createProcessDesignModal'
import { ProcessDesignProvider,ProcessDesignConsumer} from './ProcessDesignProvider'
/**模板管理 */
@withRouter@Form.create()
class ModelManager extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            component:'',
            items: [],
            isLoading: false,
            isShowCreateModal: false,

            total: 0,
            pageSize: 3,
            pageNumber: parseInt(window.location.hash.slice(1), 0) || 0,
        }
    }
   
  
    toggleShowCreateModal = (visible) => {
      this.setState({
        isShowCreateModal: visible
      })
    }

    componentDidMount() {
        this.handleAnchor()
    }
    handleAnchor=()=> {
        const {pageNumber,pageSize} = this.state
        this.onPageChange(pageNumber,pageSize); 
    }

  

    onPageChange=async (pageNumber, pageSize) =>{
        const res = await request({
            method: 'get',
            url: '/api/admin/workflow/model/page',
            data: {
                pageNumber,
                pageSize,
            }
        })
        if (res.code === 200) {
           const {content,totalElements,number} = res.result
            this.setState({
                items:content,
                pageNumber: number,
                total:totalElements
              }, () => {
                window.location.hash = `#${number}`; //设置当前页面的hash值为当前page页数
              })
        }
      }
   
    /**
     * 条件查询
     */
    onSearch=()=>{
      
    }

    /**
     * 根据id查询表单
     * @returns {*}
     */
    handleUpdate =(id)=>{
        this.toggleShowCreateProcessDesignModal(true,id?id:-1)
    }

    render() {
        const {items,isLoading,isShowCreateModal,isShowCreateProcessDesignModal,pageNumber,total,pageSize} = this.state;
        const { getFieldDecorator, selectedRowKeys } = this.props.form
        const columns = [
            {
                title: 'ID',
                dataIndex:'id',
                key: 'id',
            },
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '版本',
                dataIndex: 'revision',
                key: 'revision',
            },
            {
                title: '说明',
                dataIndex: 'metaInfo',
                render: (text, record, index) => {
                   let obj = JSON.parse(text)
                    return obj.name||''
                }
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                            <Popconfirm
                                placement="rightBottom"
                                title="此操作将永久删除, 是否继续?"
                                onConfirm={() => {

                                }}
                                okText="Yes"
                                cancelText="No">
                                <Button icon="delete" type='danger'>删除</Button>
                            </Popconfirm>&emsp;
                            <ProcessDesignConsumer>
                                {
                                  ({handleToggle}) =>(
                                    <Button type="primary" icon='edit' onClick={() => {
                                        handleToggle(record['id'])
                                    }} loading={this.state.isLoading}>绘制流程图</Button>
                                  )
                                }
                            </ProcessDesignConsumer>&emsp;
                            <Button icon="delete" type="primary">编辑</Button>
                            <ProcessDesignConsumer>
                                {
                                    ({handleFlowDeploy})=>(
                                        <Button icon="delete" type="primary" onClick={()=>{
                                            handleFlowDeploy(record['id'])
                                        }}>发布</Button>
                                    )
                                }
                             
                            </ProcessDesignConsumer>
                </span>
                )
            },
        ];
        return (<ProcessDesignProvider>
            <Card bordered={false}>
                <Form layout='inline' style={{marginBottom: 16}}>
                    <Row gutter={24}>
                        <Col span={6}>
                            <Form.Item label="名称" >
                                {getFieldDecorator('name')(
                                    <Input
                                        onPressEnter={this.onSearch}
                                        placeholder="请输入名称"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item style={{marginRight: 0, width: '100%'}} wrapperCol={{span: 24}}>
                                <div style={{textAlign: 'left'}}>
                                    <Button icon="plus" onClick={
                                     () => this.toggleShowCreateModal(true)
                                    }>添加模型</Button>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Table
                    bordered
                    dataSource={items}
                    columns={columns}
                    pagination={false}
                />
                 <CreateFlowModal onRef={this.onModalRef} visible={isShowCreateModal} toggleVisible={this.toggleShowCreateModal} />
                 <CreateProcessDesignModal  />     
            </Card>
            <div style={{textAlign: 'right'}}>
                <Pagination className="pagination-com" hideOnSinglePage={false} defaultCurrent={pageNumber} total={total}  pageSize={pageSize} onChange={this.onPageChange} />
            </div>
        </ProcessDesignProvider>)
    }
}

export default ModelManager