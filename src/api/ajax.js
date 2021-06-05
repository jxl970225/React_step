/* 
能发送异步ajax请求的函数模块

1、优化：统一处理请求异常
*/
import axios from 'axios'
import {message} from 'antd'

const BASE = 'http://localhost:5000'

export default function ajax(url, data={}, type='GET'){

    return new Promise((resolve,reject)=>{
        let promise
        //1、执行一步ajax请求
        if(type==='GET'){  //发送GET请求
            promise = axios.get(url,{ //配置对象
                params:data //指定请求参数
            })

        } else {//发送POST请求
            promise = axios.post(url,data)
        }

        //2、如果成功，调用resolve(value)
        promise.then(response =>{
            resolve(response)
        //3、如果失败，不调用reject（reason），而是提示异常信息    
        }).catch(error =>{
            message.error('请求出错： '+error.message)
        })

    })

}


//请求登录接口
// ajax('./login',{username:'Tom',password:'123456'},'POST').then()

//添加用户
// ajax('./manage/user/add',{username:'Tom',password:'123456',phone:'13263026543'},'POST').then()