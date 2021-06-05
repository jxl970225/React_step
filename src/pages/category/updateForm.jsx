import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option

//添加分类的form组件
export default class UpdateForm extends Component {

    formRef = React.createRef();

    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    }

    componentWillMount () {
        //console.log(`this.props`, this.props)
        //将form对象通过setForm()传递给父组件
        this.props.setForm(this.formRef)
    }

    render() {
        const {categoryName} = this.props || {}
        //const {getFieldDecorator} = this.formRef.current
        return (
            <Form ref={this.formRef}>
                <span>修改分类名称</span>
                <Item 
                    name="categoryName"
                    initialValue={categoryName}
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
