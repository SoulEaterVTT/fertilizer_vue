import axios from 'axios'
import { Message } from 'element-ui'
import { isEmpty } from '@/utils/mUtils'
// 创建axios实例
let baseUrl = ''
switch (process.env.NODE_ENV) {
  case 'development':
    baseUrl = 'http://192.168.31.37:8081' // 这里是本地的请求
    break
  case 'test':
    baseUrl = '' // 测试环境
    break
  case 'production':
    baseUrl = '' // 生产环境
    break
}
const service = axios.create({
  baseURL: baseUrl,
  timeout: 8000
})
// request拦截器
service.interceptors.request.use(
  config => {
    // if (!isEmpty(getToken('Token'))) {
    //   config.headers.common['Authorization'] = 'Bearer ' + getToken('Token')
    // }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (response.data.code === 200) {
        return response
      } else if (
        response.data.code === 500
      ) {
        if (!isEmpty(response.data.message)) {
          Message({
            message: response.data.message,
            type: 'error',
            duration: 3 * 1000
          })
        }
        return Promise.reject('error')
      }
    } else {
      Message({
        message: '请求失败',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('error')
    }
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    service
      .get(url, {
        params: params
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装delete方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function deleteData(url, params = {}) {
  return new Promise((resolve, reject) => {
    service
      .delete(url, {
        params: params
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    service.post(url, data).then(
      response => {
        resolve(response.data)
      },
      err => {
        reject(err)
      }
    )
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    service.put(url, data).then(
      response => {
        resolve(response.data)
      },
      err => {
        reject(err)
      }
    )
  })
}
