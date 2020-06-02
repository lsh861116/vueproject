import axios from 'axios'

import {Message, MessageBox} from 'element-ui'

import store from '../store'

//创建axios实例
const service = axios.create({
    baseURL:process.env.baseURL,
    timeout:5000
})

service.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code !== 200) {
            Message({
                message:res.message,
                type:'error',
                duration:3*1000
            })
            // 401:未登录;
            if (res.code === 401) {
                MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                store.dispatch('FedLogOut').then(() => {
                    location.reload()// 为了重新实例化vue-router对象 避免bug
                })
                })
            }
      return Promise.reject('error')
        } else {
            
        }
    },
    error => {
      console.log('err' + error)// for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error)
    }
)

export default service