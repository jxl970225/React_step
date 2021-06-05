import React, { Component } from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
import './product.less'

export default class Product extends Component {
    render() {
        return (
            <Switch>
                {/* exact 设置路径完全匹配,不设置会选择逐级匹配，从App.js找 */}
                <Route exact path='/product' component={ProductHome}></Route>
                <Route path="/product/addupdate" component={ProductAddUpdate}/>
                <Route path="/product/detail" component={ProductDetail}/>
                <Redirect to='/product'></Redirect>
            </Switch>
        )
    }
}
