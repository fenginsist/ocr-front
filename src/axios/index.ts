import axios from 'axios'

// 创建axios实例
const apiClient = axios.create({
  baseURL: '/zcocr', // 基础URL，根据你的vite.config.js中的代理配置
  timeout: 1000000, // 60秒超时，适合文件上传等耗时操作
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 统一错误处理
    if (error.code === 'ECONNABORTED') {
      console.error('请求超时，请稍后重试')
    }
    return Promise.reject(error)
  },
)

export default apiClient
