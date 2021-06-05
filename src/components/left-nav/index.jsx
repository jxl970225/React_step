import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';

import logo from "../../assets/images/logo.png"
import menuList from '../../config/menuConfig'
import './index.less'

const { SubMenu } = Menu;
class LeftNav extends Component {

    //根据menu的数据数组生成对应的标签数组
    getMenuNodes_map = (menuList) =>{
        return menuList.map(item => {
            if(!item.children){
                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            }else {
                return (
                    <SubMenu 
                        key={item.key}
                        icon={item.icon}
                        title={item.title}>
                        {this.getMenuNodes_map(item.children)}
                    </SubMenu>
                )
            }
        })
    }

    getMenuNodes = (menuList) =>{
        const path = this.props.location.pathname
        return menuList.reduce((pre,item) => {
            // 向pre中添加<Menu.Item>
            if(!item.children){
                pre.push((
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            } else {
                // 查找一个与当前请求路径匹配的子Item
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                //如果存在，说明当前item所有的子列表需要展开
                if(cItem){
                    this.openKey = item.key
                }
                
                //向pre中添加<SubMenu>
                pre.push((
                    <SubMenu 
                        key={item.key}
                        icon={item.icon}
                        title={item.title}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                ))
            }
            return pre
        },[])
    }

    /* 
    在第一次render()之前执行一次
    为第一个render()准备数据(必须同步的)
    */
    componentWillMount(){
        this.menuNodes = this.getMenuNodes(menuList)
    }
    render() {
        
        //得到当前请求路径路由
        let path = this.props.location.pathname
        if(path.indexOf('/product')===0) { //当前请求的是商品或其子路由
            path = '/product'
        }
        return (
            <div className="left-nav">
                <Link to="/"  className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h1>硅谷后台</h1>
                </Link>

                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[this.openKey]}
                    >
                    {
                        this.menuNodes
                    }   
                </Menu>
            </div>
            
        )
    }
}
export default withRouter(LeftNav)