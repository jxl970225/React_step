import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Table,
    message,

} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts,requpdateStatus } from '../../api'
import {PAGE_SIZE} from '../../utils/constants'
const Option = Select.Option
export default class ProductHome extends Component {

    
    state = {
        total: 0, //商品的总数量 
        products:[], //商品数组
        loading:false,
        searchName:'',   //搜索的关键字
        searchType:'productName',   //根据哪个字段搜索

    }

    //初始化Table的列数组
    initColumns = () => {
        const columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render:(price)=> '￥' +price  //当前指定了对应的属性，传入的是对应的属性值
            },
            {
                width:100,
                title: '状态',
                //dataIndex: 'status',
                render:(product)=>{
                    const {status,_id} = product
                    return(
                        <span>
                            <Button 
                                type='primary' 
                                onClick={()=>this.updateStatus(_id,status===1?2:1)}
                            >
                                {status===1?'下架':'上架'}
                            </Button>
                            <span>{status===1?'在售':'已下架'}</span>
                        </span>
                    )
                }
            },
            {
              title: '操作',
              width:100,
              dataIndex: '',
              key: '',
              render: (product)=> 
              (
                <span>
                    <LinkButton onClick={()=>this.props.history.push('/product/detail',{product})}>详情</LinkButton>
                    <LinkButton onClick={()=>this.props.history.push('/product/addupdate',product)}>修改</LinkButton>     
                </span>
              )
            }
        ];
        this.columns = columns
    }

    //获取指定页码列表数据显示
    getProducts = async (pageNum) => {
        this.pageNum = pageNum //保存pageNum
        this.setState({loading:true})

        const {searchName, searchType} = this.state
        let result
        //如果搜索关键字有值，说明要做搜索分页
        if (searchName) {
            console.log(`[searchType]`, [searchType])
            result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        } else { //一般分页
            result = await reqProducts(pageNum,PAGE_SIZE)
        }
        
        this.setState({loading:false})
        console.log(`result`, result)
        if(result.data.status===0) {
            //取出分页数据，更新状态，显示分页列表
            const {list,total} = result.data.data
            this.setState({
                total,
                products:list
            })
        }
    }

    //更新商品状态
    updateStatus = async (_id,status) => {
        const result =await requpdateStatus(_id,status)
        if(result.data.status==0) {
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }

    componentWillMount(){
        this.initColumns()
    }

    componentDidMount(){
        this.getProducts(1)
    }

    render() {
        //取出状态数据
        const {total,products,loading,searchType,searchName} = this.state
        const title = (
            <span>
                <Select value={searchType} style={{width:150}} 
                    onChange={value => this.setState({searchType:value})}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>

                <Input 
                    placeholder='关键字' 
                    style={{width:150, margin:'0 15px'}} 
                    value={searchName}
                    onChange={event => this.setState({searchName:event.target.value})}
                />
                <Button type='primary' onClick={()=>this.getProducts(1)}>搜索</Button>
            </span>
        )

        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                <PlusOutlined/>
                添加商品
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    loading={loading}
                    bordered
                    rowKey='_id'
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        total,
                        defaultPageSize:PAGE_SIZE,
                        showQuickJumper:true,
                        onChange:this.getProducts
                    }}
                >
                    
                </Table>
                
            </Card>
        )
    }
}
