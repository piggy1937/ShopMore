import React from 'react'
import { Form, Row, Col, Input, Button, Icon,message,Table,Select } from 'antd';
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addDynamicFormColumn,setDynamicFormColumn} from '@/store/actions'

const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const {Option}=Select
const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
    state = {
      editing: false,
      count:0,
      jdbcType: ["VARCHAR", "NVARCHAR", "NUMERIC", "DATE", "CLOB", "BLOB" ],
      javaType: ["String", "Byte", "Integer", "Long", "Double", "BigDecimal", "Boolean", "Date", "List", "Map"]
    };


    toggleEdit = () => {
      const editing = !this.state.editing;
      this.setState({ editing }, () => {
        if (editing) {
            try {
                this.input.focus();
            } catch (error) {
                
            }
         
        }
      });
    };
  
    save = e => {
      const { record, handleSave } = this.props;
      this.form.validateFields((error, values) => {
        if (error && error[e.currentTarget.id]) {
          return;
        }
        this.toggleEdit();
        handleSave({ ...record, ...values });
      });
    };
  
    renderCell = form =>{
        this.form = form;
        const { children, dataIndex, record, title } = this.props;
        const { editing } = this.state;
        if(editing){
           if(dataIndex==='jdbcType'){
     
              return ( <Form.Item style={{ margin: 0 }}>
                  {
                  form.getFieldDecorator(dataIndex, {
                      rules: [
                      {
                          required: true,
                          message: `${title} is required.`,
                      }
                      ],
                      initialValue: record[dataIndex],
                  })(
                      <Select
                      size={120}
                    >
                        {this.state.jdbcType.map(e=>(
                          <Option value={e}>{e}</Option>
                        ))}
                     
                    </Select>
                  )}
                  </Form.Item>) 
  
  
           }else if(dataIndex==='javaType'){
     
            return ( <Form.Item style={{ margin: 0 }}>
                {
                form.getFieldDecorator(dataIndex, {
                    rules: [
                    {
                        required: true,
                        message: `${title} is required.`,
                    }
                    ],
                    initialValue: record[dataIndex],
                })(
                    <Select
                    size={120}
                  >
                      {this.state.javaType.map(e=>(
                        <Option value={e}>{e}</Option>
                      ))}
                   
                  </Select>
                )}
                </Form.Item>) 


         }else{
            return ( <Form.Item style={{ margin: 0 }}>
              {
              form.getFieldDecorator(dataIndex, {
                  rules: [
                  {
                      required: true,
                      message: `${title} is required.`,
                  }
                  ],
                  //initialValue: record[dataIndex],
              })(
                 <Input ref={node => (this.input = node)} placeholder={record[dataIndex]} onPressEnter={this.save} onBlur={this.save} />
              )}
              </Form.Item>) 
           }
  
          }else{
            return (<div
                  className="editable-cell-value-wrap"
                  style={{ paddingRight: 24 }}
                  onClick={this.toggleEdit}
                  >
                  {children}
                  </div>)
          }
        }
  
    render() { 
      const {
        editable,
        dataIndex,
        title,
        record,
        index,
        handleSave,
        children,
        ...restProps
      } = this.props;
      return (
        <td {...restProps}>
          {editable ? (
            <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
          ) : (
            children
          )}
        </td>
      );
    }
  }
const store = connect(
    (state) => ({
        dataSource: state.dynamicForm.colums||[],
        columns:state.dynamicForm.colums,
     }),
    (dispatch) => bindActionCreators({addDynamicFormColumn,setDynamicFormColumn}, dispatch)
  )
  @store
  class FieldSet extends React.PureComponent{ 
     constructor(props){
         super(props)
         this.state={
            editingKey:'',
            count:0
         }
        this.columns = [{
            title: '基本信息',
            editable: true,
            children: [
                {
                  title: '名称',
                  dataIndex: 'name',
                  key: 'name',
                  editable: true,
                },{
                    title: '物理列名',
                    dataIndex: 'columnName',
                    key: 'columnName',
                    editable: true,
                  },
                  {
                    title: '别名',
                    dataIndex: 'alias',
                    key: 'alias',
                    editable: true,
                  },{
                    title: '备注',
                    dataIndex: 'describe',
                    key: 'describe',
                    editable: true,
                  },
                {
                    dataIndex: 'id',
                    key: 'id',
                }
            ]
        },
        {
            title: '数据类型',
            editable: true,
            children: [
                {
                  title: 'JDBCType',
                  dataIndex: 'jdbcType',
                  key: 'jdbcType',
                  editable: true,
                },{
                    title: 'JAVAType',
                    dataIndex: 'javaType',
                    key: 'javaType',
                    editable: true,
                  },
                  {
                    title: '长度/精度',
                    dataIndex: 'length',
                    key: 'length',
                    editable: true,
                  }]
        },{
            title: '验证器',
        },{
            title: '数据字段',
        },{
            title: '其他配置',
        },{
            title: '操作',
            render: (text, record) =>(
            this.props.dataSource.length >= 1 ? (
                <a>删除</a>
            ) : null)
        }]
     }

      componentDidMount(){
        console.log(this.props.columns)
      }


     handleSave =row => {
        const newData = [...this.props.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.props.setDynamicFormColumn({ colums: newData })
      };
    handleAdd=()=>{
        const {dataSource } = this.props;
        this.props.addDynamicFormColumn({
            key: dataSource.length,
            name: '请输入名称',
            columnName: '请输入列名',
            alias:'请输入别名',
            describe:'请输入备注',
            jdbcType:'VARCHAR',
            javaType:'String',
            length:'100',
            editable:true
        })
    }
    

      render(){
        const {count, dataSource } = this.props;
        const components = {
            body: {
              row: EditableFormRow,
              cell: EditableCell,
            },
          };

          

          const columns = this.columns.map(col => {
            if (!col.editable) {
              return col;
            }
            if(col.children){
                col.children =   col.children.map(col=>{
                    if (!col.editable) {
                        return col;
                      }
                      return {
                        ...col,
                        onCell: record => ({
                          record,
                          editable: col.editable,
                          dataIndex: col.dataIndex,
                          title: col.title,
                          handleSave: this.handleSave,
                        }),
                      };
                })
            }
            return {
              ...col,
              onCell: record => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: this.handleSave,
              }),
            };
          });

          return (<div>
            <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
             新增一行
            </Button>
            <Table components={components}
                   rowClassName={() => 'editable-row'}
            columns={columns} dataSource={dataSource} bordered size="middle" />,
          </div>)
      }
  }
  export default FieldSet;