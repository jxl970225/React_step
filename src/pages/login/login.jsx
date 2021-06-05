import React, { Component, memo } from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router';
/* 
    登录的路由组件
*/

const Item = Form.Item   //不能写在import之前
 
export default class Login extends Component {
    

    onFinish = async (values) => {
        console.log('Received values of form: ', values);
        
        const {username,password} = values
        const response = await reqLogin(username, password)
        const result = response.data
        console.log(`请求成功了`, response.data)
        if(result.status===0) {   //登陆成功
            message.success('登陆成功')

            const user = result.data
            memoryUtils.user = user //存在内存中
            storageUtils.saveUser(user) //保存在local中

            //跳转到管理界面（不需要回退，使用replace）
            this.props.history.replace('/')

        }else {   //登录失败
            message.error(result.msg)
        }
        

        /* reqLogin(username,password).then(response=>{
            console.log(`成功了`, response.data)
        }).catch(error=>{
            console.log(`失败了`, error)
        }) */
      };

    /* 对密码进行自定义验证 */
    

    render() {
        //如果用户已经登录，自动跳转到管理界面
        const user = memoryUtils.user
        if(user && user._id) {
            return <Redirect to='/'/>
        }

        //const form = this.props.form
        //const { getFieldDecorator } = this.props.form
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                    >
                        <Item
                            name="username"
                            //声明式验证：直接使用别人定义好的规则进行验证
                            rules={[
                                { required: true, message: '用户名必须输入' },
                                { min: 4, message: '用户名至少4位' },
                                { max: 12, message: '用户名最多12位' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字和下划线组成' }
                                
                            ]}

                            initialValue= 'admin'
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Item>
                        <Item
                            name="password"
                            rules={[
                                
                                ({ getFieldValue }) => ({
                                    //validator:this.validatePwd
                                    validator(_, value) {
                                        //console.log('Received pw of form: ', value);
                                        if (!value) {
                                          return Promise.reject(new Error('密码必须输入'));
                                        }else if(value.length<4) {
                                            return Promise.reject(new Error('密码长度不能小于4位'));
                                        }else if(value.length>12) {
                                            return Promise.reject(new Error('密码长度不能大于12位'));
                                        }else if(!/^[a-zA-Z0-9_]+$/.test(value)) {
                                            return Promise.reject(new Error('用户名必须是英文、数字和下划线组成'));
                                        }
                                        return Promise.resolve();
                                      }
                                  })

                            ]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="密码"
                            />
                        </Item>

                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                            </Button>
                        </Item>
                    </Form>
                </section>
                    
            </div>
        )
    }
}

/* 
    1、高阶函数
        1).一类特别的函数
            a、接收函数类型的参数
            b、返回值是函数
        2）常见
            a、定时器：setTimeout（）   setInterval（）
            b、Promise：Promise（（）=>{}）  then(value =>{},reason => {})
            c、数组遍历相关方法：forEach()   filter()   map()  reduce() find()  findIndex()
            d、函数对象的bind()
            e、Form.creat()()
        3) 高阶函数更新动态，更加具有扩展性

    2、高阶组件
        1）本质是一个函数
        2）接受一个组件(被包装组件)，返回一个新的组件(包装组件)，包装组件向被包装组件传入特定属性
        3）作用：扩展组件的功能
        4）高阶组件也是高阶函数：接收一个组件函数，返回一个新的组件函数
*/


/* 
async和await
1、作用？
    简化promise对象的使用：不用再使用then()来指定成功/失败的回调函数
    以同步编码（没有回调函数）方式实现异步流程
2、哪里写await？
    在返回promise的表达式左侧写await：不想要promise，想要promise异步执行的成功value数据
3、哪里写async？
    await所在函数（最近）定义的左侧
*/

