import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input,
} from 'antd'

const Item = Form.Item
const Option = Select.Option

//添加分类的form组件
export default class AddForm extends Component {

    formRef = React.createRef();

    state = {
        parentId:'0'
    }
    static propTypes = {
        categorys: PropTypes.array.isRequired,  //一级分类数组
        parentId: PropTypes.string.isRequired,  //父分类的ID
        parentName: PropTypes.string.isRequired,  //父分类的ID
        setForm:PropTypes.func.isRequired
    }

    change = ()=> {
        // if(parentId!==this.state.parentId){
        //     this.setState({parentId})
        // }
        //this.formRef.current.resetFields()
    }

    componentWillMount () {
        //console.log(`this.props`, this.props)
        //将form对象通过setForm()传递给父组件
        this.props.setForm(this.formRef)
        //this.setState({parentId})
        // this.formRef.current.resetFields()
        this.change()
    }
    componentDidUpdate (){
        console.log(`Update一次`)
        //console.log(`this.formRef.initialValue`, this.formRef.initialValue)
        
    }

    render() {
        const {categorys,parentId,parentName} = this.props
        //this.setState({parentId})
        console.log(`当前父分类`, parentId)
        console.log(`当前父分类name`, parentName)
        //this.change(parentId)
        return (
            <Form 
                ref={this.formRef} 
                preserve={false}
                // initialValues={{ parentId: parentId}}
            >
                <span>所属分类</span>
                <Item 
                    name="parentId"   
                    rules={[{ required: true }]}
                    //shouldUpdate = {true}
                    initialValue={parentId}
        
                    //dependencies={[parentId]}
                >
                    <Select placeholder={parentName}>

                        <Option value='0'>一级分类</Option>
                        {
                            categorys.map(c=><Option value={c._id}>{c.name}</Option>)
                        }
                    </Select>
                </Item>


                <span>分类名称</span>
                <Item name="categoryName" initialValue=''
                    rules={[ 
                        {required: true,message: '分类名称必须输入',},
                    ]}
                >
                    <Input placeholder='请输入分类名称'/>
                </Item>
                
            </Form>
        )
    }
}
