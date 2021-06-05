import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { Layout } from 'antd';
import Header from '../../components/header'
import LeftNav from '../../components/left-nav'

import Home from '../home/home'
import Category from '../category/category'
import Bar from '../charts/bar'
import Pie from '../charts/pie'
import Line from '../charts/line'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'

import memoryUtils from '../../utils/memoryUtils'

const { Footer, Sider, Content } = Layout;
export default class Admin extends Component {
    render() {
        const user = memoryUtils.user
        //如果内存中没有存储user ==>当前没有登录
        if(!user || !user._id) {
            return  <Redirect to='/login'/>
        }
        return (
            <Layout style={{height:"100%"}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{margin:20, backgroundColor:"white"}}>
                        <Switch>
                            <Route path='/home' component={Home}/> 
                            <Route path='/category' component={Category}/> 
                            <Route path='/product' component={Product}/> 
                            <Route path='/role' component={Role}/> 
                            <Route path='/user' component={User}/> 
                            <Route path='/charts/bar' component={Bar}/> 
                            <Route path='/charts/line' component={Line}/> 
                            <Route path='/charts/pie' component={Pie}/>
                            <Redirect to="/home"/>

                        </Switch>
                    </Content>
                    <Footer style={{margin:"0 auto" ,color:"#ccc"}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}
