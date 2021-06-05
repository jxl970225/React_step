import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {reqWeather} from '../../api'
import py from '../../assets/images/py.jpg'
import menuList from '../../config/menuConfig'
import {formateDate} from '../../utils/dataUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Modal} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './index.less'
import LinkButton from '../link-button'

const { confirm } = Modal;

class Header extends Component {
    state = {
        currentTime:formateDate(Date.now()),  //当前时间字符串
        weather:'',  //天气文本
    }

    getTime =()=> {
        //每隔1S获取当前时间，并更新状态数据currentTime
        this.intervalId =  setInterval(()=>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }

    getWeather = async () => {
        //调用接口请求函数
        const {dayweather} = await reqWeather('430100')
        //更新状态
        this.setState({weather:dayweather})
    }

    getTitle = () => {
        //获取当前路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item=>{
            if(item.key===path){
                title = item.title
            } else if(item.children){
                const cItem = item.children.find(cItem => cItem.key===path )
                if(cItem) {
                    title = cItem.title
                }
            }      
        })
        return title
    }

    

    logout = () => {
        var repalceLogin = () => {
            this.props.history.replace('/login')
        }
        //显示确认框
        confirm({
            title: '确定退出吗?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                //   console.log('是的');
                //删除保存的user数据
                memoryUtils.user = {}
                storageUtils.removeUser()

                //跳转到login
                repalceLogin()
            },
            onCancel() {
                console.log('取消');
            },
        });
    }

    /* 
    第一次render()之后执行一次
    一般在此执行异步操作：发ajax请求/启动定时器
    */
    componentDidMount () {
        //获取当前时间
        this.getTime()
        this.getWeather()
    }

    //当前组件卸载之前调用
    componentWillUnmount () {
        //清除定时器
        clearInterval(this.intervalId)
    }
    render() {
        const {currentTime, weather} =this.state
        const username = memoryUtils.user.username
        const title = this.getTitle()
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎, {username}</span>
                    <LinkButton href="javascript:" onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={py} alt=""/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}


export default withRouter(Header)