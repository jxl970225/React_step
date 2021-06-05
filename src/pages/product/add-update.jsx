import React, { Component } from 'react'
import {
    Card,
    Form,
    Input,
    Cascader,
    Upload,
    Button,
    message,
} from 'antd'

import PicturesWall from './pictures-wall'
import { PlusOutlined,ArrowLeftOutlined  } from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import {reqCategorys} from '../../api'
const Item = Form.Item
const { TextArea } = Input;

const formItemLayout = {
    labelCol: { span: 2 },  //左侧label的宽度
    wrapperCol: { span: 10 }, //指定右侧包裹的宽度
  };
export default class ProductAddUpdate extends Component {
    formRef = React.createRef();
    pw = React.createRef()
    state = {
        options:[],
    }

    // constructor (props) {
    //     super(props)

    //     // 创建用来保存ref表示的标签对象容器
    //     this.
    // }

    initOptions = async (categorys) => {
        // 根据categorys生成options数组
        const options = categorys.map(c => ({
            value:c._id,
            label:c.name,
            isLeaf:false     //不是叶子
        }))
        //如果是一个二级分类商品的更新
        const {isUpdate, product} = this
        const {pCategoryId, categoryId} = product
        if(isUpdate && pCategoryId!=='0') {
            //获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            //生成二级下拉列表options
            const childOptions = subCategorys.map(c => ({
                value:c._id,
                label:c.name,
                isLeaf:true     //是叶子
            }))
            //找到当前商品对应的一级option
            const targetOption = options.find(option => option.value===pCategoryId)
            //关联到对应的一级option上
            targetOption.children = childOptions            
        }

        //更新options状态
        this.setState({
            options
        })
    }

    //获取一级/二级分类列表，并显示
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        
        if(result.data.status===0) {
            const categorys = result.data.data
            //如果是一级分类列表
            if(parentId==='0') {
                this.initOptions(categorys)
            }else {
                return categorys
            }
        }
    }

    validatePrice = (_, value) => {
        console.log(`value`, typeof value)
        if (value*1>0) {
            return Promise.resolve()
            // callback() //验证通过
        } else {
            return Promise.reject(new Error('价格必须大于0'))
            // callback('价格必须大于0')
        }  
    }

    submit = () => {
        //console.log(`('发送ajax请求')`)
        //alert('发送ajax请求')
        this.formRef.current.validateFields().then(async(values)=>{
            console.log(`submit()`, values)

            const imgs =  this.pw.current.getImgs()
            console.log(`imgs`, imgs)
            alert('发送ajax请求')
        })
    }

    loadData = async selectedOptions => {
        //得到选择的option对象
        // const targetOption = selectedOptions[selectedOptions.length - 1];
        const targetOption = selectedOptions[0];
        // 显示loading
        targetOption.loading = true;
        //根据选中的分类，请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        // 隐藏loading
        targetOption.loading = false;
        //二级分类数组有数据
        if(subCategorys && subCategorys.length>0) {
            //生成一个二级列表的options
            const cOptions = subCategorys.map(c => ({
                value:c._id,
                label:c.name,
                isLeaf:true     //是叶子
            }))
            //关联到但当前的option上
            targetOption.children = cOptions
        } else { //当前选中分类没有二级分类
            targetOption.isLeaf = true
        }
    };

    componentDidMount () {
        this.getCategorys('0')
    }

    componentWillMount () {
        //取出携带的state
        const product = this.props.location.state
        //是否是更新的标识
        this.isUpdate = !!product
        this.product = product || {}
    }

    render() {
        const {isUpdate, product} = this
        const {pCategoryId, categoryId} = product
        //用来接收级联分类ID的数组
        const categoryIds = []
        if(isUpdate) {
            //商品是一级分类
            console.log(`pCategoryId`, pCategoryId)
            console.log(`categoryId`, categoryId)
            if(pCategoryId==='0') {
                categoryIds.push(categoryId)
            }else {
                //商品是二级分类
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
            
        }
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                <ArrowLeftOutlined style={{fontSize:20}}/>
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )

        

        
        return (
            <Card title={title}>
                <Form {...formItemLayout} ref={this.formRef}>
                    <Item label='商品名称' name='productName'
                        initialValue={product.name}
                        rules={[
                            {required:true, message:'必须输入商品名称'},
                            
                        ]}
                    >
                        <Input placeholder='请输入商品名称'/>
                    </Item>
                    <Item label='商品描述' name='productDesc'
                        initialValue={product.desc}
                        rules={[{required:true, message:'必须输入商品描述'}]}
                    >
                    <TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 6 }} />
                    </Item>
                    <Item label='商品价格' name='price'
                        initialValue={product.price}
                        rules={[
                            {required:true, message:'必须输入商品价格'},
                            {validator:this.validatePrice}
                        ]}
                    >
                        <Input type='number' placeholder='请输入商品名称' addonAfter="元"/>
                    </Item>
                    <Item label='商品分类' name='categoryIds'
                        initialValue={categoryIds}
                        rules={[{required:true, message:'必须输入商品分类'}]}
                    >
                        <Cascader 
                            options={this.state.options} 
                            loadData={this.loadData}  //当选择某个列表项，加载下一级列表的监听回调
                        />
                    </Item>
                    <Item label='商品图片' name='productImg'>
                        <PicturesWall ref={this.pw}/>
                        
                    </Item>
                    <Item label='商品详情' name='productInfo'>
                        <div>商品详情</div>
                    </Item>
                    <Button type='primary' onClick={this.submit}>提交</Button>
                </Form>
            </Card>
        )
    }
}
