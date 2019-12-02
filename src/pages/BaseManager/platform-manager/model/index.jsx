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
    InputNumber, message,
} from 'antd'
import request from '@/utils/request'
import {withRouter} from 'react-router-dom'
import CreateFlowModal from './createFlowModal'
import CreateProcessDesignModal from './createProcessDesignModal'
import { ProcessDesignProvider,ProcessDesignConsumer} from './ProcessDesignProvider'
const { Search } = Input;
const EditableContext = React.createContext();
class EditableCell extends React.Component {
    getInput = () => {
        return <Input />;
    };

    renderCell = ({ getFieldDecorator }) => {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: true,
                                    message: `Please Input ${title}!`,
                                },
                            ],
                            initialValue: record[dataIndex],
                        })(this.getInput())}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}


/**模板管理 */
@withRouter@Form.create()
class ModelManager extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            component: '',
            items: [],
            isLoading: false,
            isShowCreateModal: false,
            editingKey: '',

            total: 0,
            pageSize: 3,
            pageNumber: parseInt(window.location.hash.slice(1), 0) || 0,
        }
        this.columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key:'id'
            },
            {
                title: '名称',
                dataIndex: 'name',
                editable: true,
                key:'name'
            },
            {
                title: '版本',
                dataIndex: 'revision',
                key:'revision'
            },
            {
                title: '说明',
                dataIndex: 'description',
                editable: true,
                key:'description',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    const {editingKey} = this.state;
                    const editable = this.isEditing(record);
                    return editable ? (
                        <span>
              <EditableContext.Consumer>
                {form => (
                    <a
                        onClick={() => this.save(form, record.id)}
                        style={{marginRight: 8}}
                    >
                        保存
                    </a>
                )}
              </EditableContext.Consumer>
              <a
                  onClick={() => this.cancel(record.id)}
                  style={{marginRight: 8}}
              >
                        取消
                    </a>
            </span>
                    ) : (
                        <span>
                                  <Popconfirm
                                      placement="rightBottom"
                                      title="此操作将永久删除, 是否继续?"
                                      onConfirm={() => {
                                        this.handleDelete(record.id)
                                      }}
                                      okText="Yes"
                                      cancelText="No">
                                <Button icon="delete" type='danger'>删除</Button>
                            </Popconfirm>&emsp;
                            <ProcessDesignConsumer>
                                {
                                    ({handleToggle}) => (
                                        <Button type="primary" icon='edit' onClick={() => {
                                            handleToggle(record['id'])
                                        }} loading={this.state.isLoading}>绘制流程图</Button>
                                    )
                                }
                            </ProcessDesignConsumer>&emsp;
                            <Button disabled={editingKey !== ''} onClick={() => this.edit(record.id)} type="primary">
                            编辑
                        </Button>
                        </span>
                    );
                },
            },
        ];
    }


    isEditing = record => record.id === this.state.editingKey;
    cancel = () => {
        this.setState({editingKey: ''});
    };

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.items];
            const index = newData.findIndex(item => key === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.handleUpdateFlowModal(newData[index])
                this.setState({items: newData, editingKey: ''});
            } else {
                newData.push(row);
                this.setState({items: newData, editingKey: ''});
            }
        });
    }

    /**
     * 修改模型
     * @param key
     */
    handleUpdateFlowModal = async (value) => {
        const {name,description,id,revision} = value
        const modelId = id;
        let data ={
            name,
            description,
            revision
        }

        const ret = await request({
            method:'put',
            url:`/api/admin/workflow/model/${modelId}`,
            data
        });
        if (ret.code === 200) {
            message.success("修改成功")
            this.handleAnchor()
        } else {
            message.error((ret.message))
        }
    }

    /**
     * 删除
     * @param id
     */
    handleDelete=(modelId)=>{
        request({
            method:'delete',
            url:`/api/admin/workflow/model/${modelId}`,
        }).then(res=>{
            if(res.code === 200){
                message.success('删除成功');
                this.handleAnchor()
            }else{
                message.error('删除失败');
            }
        }).catch(err=>{
            message.error(err)
        })
    }



    edit(key) {
        this.setState({ editingKey: key });
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



    onPageChange=async (pageNumber , pageSize) =>{
        this.cancel()
        const number=pageNumber<1?0:pageNumber-1
        const res = await request({
            method: 'get',
            url: '/api/admin/workflow/model/page',
            data: {
                pageNumber:number,
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
     * 根据id查询表单
     * @returns {*}
     */
    handleUpdate =(id)=>{
        this.toggleShowCreateProcessDesignModal(true,id?id:-1)
    }

    render() {
        const {items,isLoading,isShowCreateModal,isShowCreateProcessDesignModal,pageNumber,total,pageSize} = this.state;
        const { getFieldDecorator, selectedRowKeys } = this.props.form
        const components = {
            body: {
                cell: EditableCell,
            },
        };

        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });


        return (<ProcessDesignProvider>
            <Card bordered={false}>
                <Form layout='inline' style={{marginBottom: 16}}>
                    <Row gutter={24}>
                        <Col span={6}>
                            <Form.Item label="名称" >
                                {getFieldDecorator('cname')(
                                    <Search
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
                <EditableContext.Provider value={this.props.form}>
                    <Table
                        bordered
                        dataSource={items}
                        columns={columns}
                        components={components}
                        pagination={false}
                    />
                </EditableContext.Provider>
                <CreateFlowModal onRef={this.onModalRef} visible={isShowCreateModal} toggleVisible={this.toggleShowCreateModal} onRefresh={this.handleAnchor}/>
                <CreateProcessDesignModal  />
            </Card>
            <div style={{textAlign: 'right'}}>
                <Pagination className="pagination-com" hideOnSinglePage={false} defaultCurrent={pageNumber} total={total}  pageSize={pageSize} onChange={this.onPageChange} />
            </div>
        </ProcessDesignProvider>)
    }
}

export default ModelManager
