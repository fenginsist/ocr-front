import apiClient from '@/axios/index'

/**
 * 上传文件进行OCR识别
 * @param {File} file - 要识别的文件
 * @returns {Promise} - 返回Promise对象
 */
export const uploadFileForOCR = (file: File): Promise<any> => {
  const formData = new FormData()
  formData.append('file', file)

  return apiClient.post('/get/file/content', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 如果后续有其他OCR相关的API，可以继续添加
// export const getOCRHistory = () => {
//   return apiClient.get('/history')
// }
