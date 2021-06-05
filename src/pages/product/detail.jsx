import React, { Component } from 'react'
import {
    Card,
    List,

} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api'

const Item = List.Item

export default class ProductDetail extends Component {

    state = {
        cName1:'',  //一级分类名称
        cName2:'',   //二级分类名称
    }
    async componentDidMount () {
        const {pCategoryId,categoryId} = this.props.location.state.product
        console.log(`categoryId`, categoryId)
        console.log(`pCategoryId`, pCategoryId)
        if(pCategoryId==='0') {  //一级分类下的商品
            const result = await reqCategory(categoryId)
            console.log(`详情result`, result)
            const cName1 = result.data.data.name
            this.setState({cName1})
        } else { //二级分类下的商品
/*             const result1 = await reqCategory(pCategoryId)
            const result2 = await reqCategory(categoryId)
            const cName1 = result1.data.data.name
            const cName2 = result2.data.data.name */

            //一次性发送多个请求，只有都成功了，才正常处理！
            const result = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
            const cName1 = result[0].data.data.name
            const cName2 = result[1].data.data.name 
            this.setState({
                cName1,
                cName2
            })
        }
    }

    render() {
        //读取携带过来的数据state
        const {name,desc,price,detail,imgs} = this.props.location.state.product
        const {cName1,cName2} = this.state

        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined style={{marginRight:10,fontSize:20}}
                        onClick={()=>this.props.history.goBack()}    
                    />
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <span className='left'>商品名称:</span>
                        <span>{name}</span>
                    </Item>

                    <Item>
                        <span className='left'>商品描述:</span>
                        <span>{desc}</span>
                    </Item>

                    <Item>
                        <span className='left'>商品价格:</span>
                        <span>{price}元</span>
                    </Item>
                    <Item>
                        <span className='left'>所属分类:</span>
                        <span>{cName1}{cName2?'-->'+cName2:cName2}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品图片:</span>
                        <span>
                            {
                                imgs.map(img => (
                                   <img 
                                        key={img}
                                        className='product-img' 
                                        src= {BASE_IMG_URL+img}
                                        alt="img"
                                    /> 
                                ))
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className='left'>商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html:detail}}></span>
                    </Item>
                </List>
            </Card>

        )
    }
}
