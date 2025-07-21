<template>
  <div class="container">
    <el-upload
      class="upload-area"
      drag
      action=""
      :auto-upload="false"
      :on-change="handleFileChange"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        拖拽文件到这里，或 <em>点击上传</em>
      </div>
      <div class="el-upload__tip">支持 PDF、Word 等文档</div>
    </el-upload>

    <el-button
      class="submit-button"
      type="primary"
      :disabled="!selectedFile || loading"
      @click="submitFile"
    >
      {{ loading ? '识别中...' : '点击识别' }}
    </el-button>

    <div class="result-box">
      <div class="result-text">
        {{ resultText || '识别结果将显示在这里...' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const selectedFile = ref(null)
const resultText = ref('')
const loading = ref(false)

const handleFileChange = (file) => {
  selectedFile.value = file.raw
}

const submitFile = async () => {
  if (!selectedFile.value) return

  loading.value = true
  resultText.value = ''

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  try {
    const response = await axios.post('/zcocr/get/file/content', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    // console.log('11111',response)
    // console.log('22222',response.data)
    // console.log('33333',response.data.data)
    resultText.value = response.data.data[0] || '识别完成，但未返回文本内容。'
  } catch (error) {
    resultText.value = '识别失败，请稍后重试。'
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background-color: #fff;
  text-align: center;
}

.upload-area {
  margin-bottom: 20px;
}

.submit-button {
  margin-bottom: 20px;
  width: 100%;
  font-size: 16px;
}

.result-box {
  height: 200px;
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  text-align: left;
  overflow-y: auto;
  background-color: #f9f9f9;
}

.result-text {
  white-space: pre-wrap;
  color: #333;
  font-size: 14px;
  line-height: 1.6;
}
</style>
