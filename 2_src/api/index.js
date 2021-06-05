/* 
要求：能根据接口文档定义结构请求
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise

基本要求：能够根据接口文档定义接口函数
*/

import { message } from "antd";
import jsonp from "jsonp";
import ajax from "./ajax";
const BASE = 'http://120.55.193.14:5000'
//登录
/* export function reqLogin() {
    ajax('./login',{username,password},'POST') 

} */

export const reqLogin = (username,password)=>ajax(BASE + '/login',{username,password},'POST') 

//添加用户
export const reqAddUser = (user)=>ajax(BASE + '/manage/user/add',user,'POST') 

//获取一级/二级分类的列表
export const reqCategorys = (parentId)=>ajax(BASE + '/manage/category/list',{parentId}) 
console.log('列表测试',reqCategorys('0'))
//添加分类
export const reqAddCategory = (categoryName,parentId)=>ajax(BASE + '/manage/category/add',{categoryName,parentId},'POST') 

//更新分类
export const reqUpdateCategory = (categoryId,categoryName)=>ajax(BASE + '/manage/category/update',{categoryId,categoryName},'POST') 
console.log('更新测试',reqCategorys('5fe500cecc325b1aceb361ef',"粮食好吃"))
//const result1 = await reqUpdateCategory({categoryId:'5fe500cecc325b1aceb361ef',categoryName:'粮食好吃'})

//获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info',{categoryId})
// console.log('获取一个分类测试',reqCategory('600a461241b0eb5dad7a45e4'))


//获取商品分页页表
export const reqProducts = (pageNum,pageSize)=>ajax(BASE + '/manage/product/list',{pageNum,pageSize}) 

//更新商品状态
export const requpdateStatus = (productId,status)=>ajax(BASE + '/manage/product/updateStatus',{productId,status},'POST') 


// 搜索商品分页列表
//searchType：搜索类型 productName/productDesc
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType})=>ajax(BASE + '/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName,
})

//删除图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete',{name},'POST')

/* 
json请求的结构函数
*/
export const reqWeather = (citycode) => {
    return new Promise((resolve,reject) => {
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=8ac7e1cba0d0f340c02aec203255ad35&city=${citycode}&extensions=all&output=JSON`

        jsonp(url,{},(err,data) => {
            console.log(`jsonp()`, err,data)
            //如果成功
            if(!err && data.status === "1") {
                const {date,dayweather} = data.forecasts[0].casts[0]
                resolve({date,dayweather})
            }else {
                //如果失败
                message.error('获取天气信息失败！')
            }
        })        
    })

}

reqWeather('430100')