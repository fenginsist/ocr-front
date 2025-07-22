<template>
  <div class="page-container">
    <header class="ocr-header">
      <div class="ocr-header-left">
        <img src="../assets/images/infor-logo.png" alt="logo" />
        <span class="ocr-assistant-title">识别小助手</span>
      </div>
      <div class="ocr-header-right">
        <div class="el-dropdown">
          <div class="user-info">
            <span class="avatar-user"><el-icon><UserFilled /></el-icon></span>
            <span class="user-id">005878</span>
          </div>
        </div>
      </div>
    </header>
    <div class="ocr-container">
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

.page-container{
  height: 100%;
}

.ocr-container {
  max-width: 600px;
  margin: 0px auto;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background-color: #fff;
  text-align: center;
}

.ocr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid rgba(219, 224, 232, .7);
  height: 48px !important;
  background-color: #fff;
  width: 100%;

  padding: 0 20px;
}

.ocr-header-left {
  display: flex;
  align-items: center;
}

.ocr-header .ocr-assistant-title {
  font-weight: 700;
  font-size: 20px;
  margin-left: 10px;
  color: #606266;
}

.ocr-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.el-dropdown {
  display: inline-block;
  position: relative;
  color: #606266;
  font-size: 14px;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar-user, .user-id {
  margin-left: 10px;
}

.upload-area {
  margin-bottom: 20px;
  height: 100px;
}

.submit-button {
  margin-top: 20px;
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
