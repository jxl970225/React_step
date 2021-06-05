import React, { Component } from 'react'

import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {reqDeleteImg} from '../../api'
import { BASE_IMG_URL } from '../../utils/constants';
import PropTypes from 'prop-types'
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends React.Component {

    static propTypes = {
        imgs:PropTypes.array
    }


    constructor (props) {
        super(props)

        let fileList = []
        //如果传入了img属性
        const {imgs} = this.props
        if(imgs && imgs.length>0) {
            fileList = imgs.map(img => ({
                uid:'-index',
                name:'name',
                status:'done',
                url:BASE_IMG_URL+img
            }))
        }
        this.state = {
            previewVisible: false,  //标识是否显示大图预览的modal
            previewImage: '',    //大图的url
            fileList
        }
    }

    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    //隐藏modal
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {

        console.log(`file`, file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    //当前操作的图（上传/删除）
    handleChange = async ({ file, fileList }) => {
        console.log(`handleChange`,file,fileList)

        //一旦上传成功，将当前上传的file的信息修正（name，url）
        if(file.state==='done') {
            const result = file.response
            if(result.status===0) {
                message.success('上传图片成功')
                const {name, url } = result.data
                file = fileList[fileList.length-1]
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败')
            }
        } else if(file.status==='removed') { //删除图片
            const result = await reqDeleteImg(file.name)
            console.log(`result`, result)
            if(result.data.status===0) {
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }
        }

        this.setState({ fileList })};

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
        );
    return (
      <>
        <Upload
            action="http://120.55.193.14:5000/manage/img/upload"
            accept='image/*'    //只接收图片类型
            name='iamge'     //请求参数名
            listType="picture-card"    //卡片样式
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
        >
            {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={this.handleCancel}
        >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

/* 
1、子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以掉用
2、父组件调用子组件的方法：在父组件中通过ref得到子组件 

*/
