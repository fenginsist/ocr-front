<template>
  <div class="page-container">
    <!-- 头部 -->
    <header class="ocr-header">
      <div class="ocr-header-left">
        <img src="../assets/images/infor-logo.png" alt="logo" />
        <span class="ocr-assistant-title">识别小助手</span>
      </div>
      <div class="ocr-header-right">
        <div class="el-dropdown">
          <div class="user-info">
            <!-- <span class="avatar-user">
              <el-icon><UserFilled /></el-icon>
            </span> -->
            <el-dropdown>
              <span class="el-dropdown-link">
                <span class="avatar-user">
                  <el-icon><UserFilled /></el-icon>
                </span>
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>注销</el-dropdown-item>
                  <el-dropdown-item disabled>禁用demo</el-dropdown-item>
                  <el-dropdown-item divided>分别demo</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <span class="user-id">005878</span>
          </div>
        </div>
      </div>
    </header>
    <!-- 下面：左右，两部分 -->

    <div class="ocr-container">
      <!-- 左 -->
      <div class="ocr-sidebar">
        <!-- <div class="ocr-text"><span>识别</span></div> -->
        <div class="ocr-record-collect">
          <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="识别记录" name="first">
              <span>历史记录待实现</span>
            </el-tab-pane>
            <el-tab-pane label="收藏" name="second">
              <span>收藏待实现</span>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!-- 右 -->
      <div class="ocr-main">
        <el-upload
          class="upload-area"
          drag
          action=""
          :auto-upload="false"
          :on-change="handleFileChange"
        >
          <!-- <i class="el-icon-upload"></i> -->
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽文件到这里，或 <em>点击上传</em></div>
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
  </div>
</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import type { TabsPaneContext } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

import { ref } from 'vue'
import axios from 'axios'

const selectedFile = ref<File | null>(null)
const handleFileChange = (file: UploadFile) => {
  if (file.raw) {
    selectedFile.value = file.raw
  }
  // selectedFile.value = file.raw // 报错：确保 file.raw 不为 undefined，再赋值：
  // 或者简写：
  // selectedFile.value = file.raw ?? null
}

const resultText = ref('')
const loading = ref(false)

const submitFile = async () => {
  if (!selectedFile.value) return

  loading.value = true
  resultText.value = ''

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  try {
    const response = await axios.post('/zcocr/get/file/content', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<style scoped>
.page-container {
  height: 100%;
}

.ocr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid rgba(219, 224, 232, 0.7);
  height: 48px !important;
  background-color: #fff;
  /* width: 100%;  */ /* 放开这个，会导致左右出现滚动条  */

  /* padding: 0 20px; */
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

.avatar-user,
.user-id {
  margin-left: 10px;
}

.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.upload-area {
  display: flex;
  flex-direction: column;
  /* height: 100%; */ /* 加上这个和内部的（也就是下面的）height: 300px;冲突了  */
}

:deep(.el-upload-dragger) {
  height: 300px;
}

.ocr-container {
  display: flex;
}

.ocr-sidebar {
  width: 30%;
  height: 100%;
}

.ocr-text {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
}
.ocr-record-collect {
  display: flex;
  margin-top: 10px;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

:deep(.el-tabs) {
  width: 100%;
}

::v-deep(.el-tabs__nav) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

::v-deep(.el-tabs__item) {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;

  box-sizing: border-box;

  text-align: center;
  height: 48px;
  font-size: 16px;
  padding: 0;
}

::v-deep(.el-tabs__active-bar) {
  height: 3px;
  background-color: #409eff;
  width: 50% !important;
  left: 0 !important;
  transition: transform 0.3s ease;
}

::v-deep(.el-tabs__item:nth-child(2).is-active ~ .el-tabs__active-bar) {
  transform: translateX(100%);
}

.ocr-main {
  display: flex;
  flex-direction: column; /** 上下排列 */

  width: 100%;
  /* margin: 0px auto; */
  padding: 24px;
  border-left: 1px solid #767373;
  /* box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); */
  /* border-radius: 12px; */
  background-color: #fff;
  text-align: center;
}

.submit-button {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
  font-size: 16px;
}

.result-box {
  height: 400px;
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
