import React, { Component } from 'react'
import { 
    Card,
    Button,
    Table,
    message,
    Modal
    
 } from 'antd'
import AddForm from './addForm'
import UpdateForm from './updateForm'
import {PlusOutlined, CaretRightOutlined} from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api'

export default class Category extends Component {

    state = {
        categorys : [], //一级分类列表
        loading:false,
        subCategorys:[], //二级分类列表
        parentId: '0', //当前需要显示的分类列表的父分类ID
        parentName:'一级分类', //当前需要显示的分类列表的父分类名称
        showStatus: 0, //表示添加/更新确认框是否显示，0：都不显示，1：显示添加 2：显示更新
    }

    //初始化Table的列数组
    initColumns = () => {
        const columns = [
            {
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '操作',
              width:300,
              dataIndex: '',
              key: '',
              render: (category)=> 
              (
                <span>
                    <LinkButton onClick = {()=>this.showUpdate(category)}>修改分类</LinkButton>
                    {/* 如何向事件回调函数传递参数，先定义一个匿名函数，在函数中调用处理的函数并传入参数 */}
                    
                    {
                        this.state.parentId==='0'?<LinkButton onClick={()=>this.showSubCategorys(category)}>查看子分类</LinkButton>:null
                    }
                    
                </span>
              )
            }
        ];
        this.columns = columns
    }

    //parentId:如果没有指定根据状态中parentId请求
    getCategorys = async (parentId) => {
        //const {parentId} = this.state
        //在发请求前
        this.setState({loading:true})
        parentId = parentId || this.state.parentId
        //发异步ajax请求获取数据
        const result = await reqCategorys(parentId)
        this.setState({loading:false})
        console.log(`result.status`, result.data)
        if(result.data.status === 0) {
            if(parentId==='0'){
                const categorys = result.data.data
                //更新状态
                this.setState({categorys})
            }else {
                const subCategorys = result.data.data
                //更新状态
                this.setState({subCategorys})
            }
            
        }else {
            message.error('获取分类列表失败')
        }
        
    }

    ///显示指定一级分类对象的二级列表
    showSubCategorys = (category) => {
        //清除数据
        // this.form.current.resetFields()
        //更新状态
        this.setState({
            parentId:category._id,
            parentName:category.name
        },()=>{ //在状态更新且重新render（）后执行
            console.log(`parentId`, this.state.parentId)
        //获取二级列表显示
        this.getCategorys()
        })
        //setState()不能立即获取最新的状态：因为setState()是异步更新状态的
    }

    //显示一级列表
    showCategorys = () => {
        //清除数据
        // this.form.current.resetFields()
        this.setState({
            parentId:'0',
            parentName:'一级分类',
            subCategorys:[]
        })
    }
    //响应点击取消
    handleCancel = () => {
        // this.form.current.resetFields()
        //隐藏确认框
        this.setState({
            showStatus:0
        })
    }

    //显示添加确认框
    showAdd = () => {
        // this.form.current.resetFields()
        this.setState({
            showStatus: 1
        })
        
    }

    //添加分类
    addCategory = async () => {
        console.log(`addCategory`)
        this.form.current.validateFields().then(async(values)=>{
            //隐藏确认框
            this.setState({
                showStatus: 0
            })
            console.log(`this.form`, this.form)
            const {parentId, categoryName} = this.form.current.getFieldsValue()
            console.log(`parentId`, parentId,"    categoryName",categoryName)
            //清除数据(给Modal设置destroyOnClose={true}则不需要resetFields)
            // this.form.current.resetFields()      

            const result = await reqAddCategory(categoryName, parentId)
            if(result.data.status===0)
            {
                if(parentId===this.state.parentId){
                //3、重新显示列表
                    this.getCategorys() 
                }else if(parentId==='0') {  //在二级分类列表下添加一级分类
                    this.getCategorys('0') 
                }
                
            }
        })

    }

    //显示修改确认框
    showUpdate = (category) => {
        //保存分类对象
        this.category = category
        console.log(`category`, category)
        this.setState({
            showStatus: 2
        })
    }

    //更新分类
    updateCategory = () => {
        console.log(`updateCategory`)
        //进行表单验证，通过则处理
        this.form.current.validateFields().then(async(values)=>{
            //1、隐藏确认框
            this.setState({
                showStatus:0
            })
            //console.log(`this.form`, this)
            const categoryId = this.category._id
            const {categoryName} = values
            console.log(`更新categoryName`, categoryName)
            //清除数据
            this.form.current.resetFields()
            
            //2、发请求更新
            const result = await reqUpdateCategory(categoryId,categoryName)
            if(result.data.status===0)
            {
                //3、重新显示列表
                this.getCategorys()
            }           
        }) 
    }

    componentWillMount(){
        this.initColumns()
    }

    //异步ajax请求
    componentDidMount(){
        this.getCategorys()
    }

    // componentWillReceiveProps(nextProps) {
    //     if (!nextProps.modal.modalUpdateDetail) {
    //       this.props.form.resetFields();
    //     }
    // }

    render() {

        //读取列表数据
        const { loading,subCategorys,parentId,parentName, categorys,showStatus} = this.state
        
        //读取指定分类
        const category = this.category || {}

        //card左侧
        const title = parentId === '0'?'一级分类标题':(
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <CaretRightOutlined style={{marginRight:10}}/>
                <span>{parentName}</span>
            </span>
        )
        //右侧标题
        const extra= (
            <Button type="primary" onClick={this.showAdd}>
                <PlusOutlined />
                添加
            </Button>
        )
          
          
        return (
            <Card title={title} extra={extra}>
                <Table 
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={parentId==='0' ? categorys : subCategorys} 
                    columns={this.columns} 
                    pagination={{defaultPageSize:8,showQuickJumper:true,}}
                />;

                <Modal 
                    destroyOnClose={true}
                    title="添加分类" 
                    visible={showStatus===1} 
                    onOk={this.addCategory} 
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categorys={categorys}
                        parentId = {parentId}
                        parentName={parentName}
                        setForm={(form)=>{this.form = form}}
                    />

                </Modal>

                <Modal 
                    destroyOnClose={true}
                    title="更新分类" 
                    visible={showStatus===2} 
                    onOk={this.updateCategory} 
                    onCancel={this.handleCancel}
                >
                    <UpdateForm 
                        categoryName={category.name} 
                        setForm={(form)=>{this.form = form}}
                    />
                </Modal>
            </Card>
        )
    }
}
