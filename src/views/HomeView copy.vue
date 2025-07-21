<template>
  <div class="upload-container">
    <div class="upload-wrapper">
      <el-upload
        class="upload-box"
        drag
        action=""
        :auto-upload="false"
        :on-change="handleFileChange"
        :show-file-list="false"
        :accept="acceptFileTypes"
      >
        <div class="upload-content">
          <el-icon class="upload-icon"><upload-filled /></el-icon>
          <div class="upload-text">
            <p class="main-text">拖拽文件到此处或 <span class="link-text">点击上传</span></p>
            <p class="hint-text">支持PDF、Word、图片等文件 (最大10MB)</p>
          </div>
        </div>
      </el-upload>

      <div class="file-info" v-if="selectedFile">
        <el-icon class="file-icon"><document /></el-icon>
        <div class="file-details">
          <span class="file-name">{{ selectedFile.name }}</span>
          <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
        </div>
        <el-icon class="delete-icon" @click="clearFile"><close /></el-icon>
      </div>
    </div>

    <el-button
      class="submit-btn"
      type="primary"
      :loading="loading"
      @click="submitFile"
      :disabled="!selectedFile"
      round
    >
      {{ loading ? '识别中...' : '开始识别' }}
    </el-button>

    <el-card class="result-card" v-if="result" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>识别结果</span>
          <el-button
            class="copy-btn"
            type="text"
            @click="copyResult"
            :icon="DocumentCopy"
          >复制</el-button>
        </div>
      </template>
      <div class="result-content">
        <el-scrollbar>
          <pre>{{ result }}</pre>
        </el-scrollbar>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { UploadFilled, Document, Close, DocumentCopy } from '@element-plus/icons-vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const selectedFile = ref(null);
const result = ref('');
const loading = ref(false);
const acceptFileTypes = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.bmp,.tiff';

const handleFileChange = (file) => {
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.warning('文件大小不能超过10MB');
    return;
  }
  selectedFile.value = file.raw;
};

const clearFile = () => {
  selectedFile.value = null;
  result.value = '';
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const submitFile = async () => {
  if (!selectedFile.value) return;
  
  loading.value = true;
  result.value = '';
  
  try {
    const formData = new FormData();
    formData.append('file', selectedFile.value);
    
    const response = await axios.post('http://localhost:8000/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    result.value = response.data.extracted_text;
    ElMessage.success('识别成功');
  } catch (error) {
    console.error('Error:', error);
    ElMessage.error('文件处理失败: ' + (error.response?.data?.detail || error.message));
  } finally {
    loading.value = false;
  }
};

const copyResult = () => {
  navigator.clipboard.writeText(result.value)
    .then(() => ElMessage.success('已复制到剪贴板'))
    .catch(() => ElMessage.error('复制失败'));
};
</script>

<style scoped>
.upload-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
}

.upload-wrapper {
  margin-bottom: 24px;
}

.upload-box {
  border: 2px dashed var(--el-border-color);
  border-radius: 8px;
  background-color: var(--el-fill-color-light);
  transition: border-color 0.3s;
}

.upload-box:hover {
  border-color: var(--el-color-primary);
}

.upload-content {
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  font-size: 48px;
  color: var(--el-color-primary);
  margin-bottom: 16px;
}

.upload-text {
  text-align: center;
}

.main-text {
  font-size: 16px;
  margin-bottom: 8px;
  color: var(--el-text-color-regular);
}

.link-text {
  color: var(--el-color-primary);
  font-weight: 500;
}

.hint-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.file-info {
  margin-top: 16px;
  padding: 12px;
  border-radius: 6px;
  background-color: var(--el-fill-color-light);
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  font-size: 24px;
  color: var(--el-color-primary);
}

.file-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.file-name {
  font-size: 14px;
  color: var(--el-text-color-regular);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.delete-icon {
  cursor: pointer;
  color: var(--el-text-color-secondary);
}

.delete-icon:hover {
  color: var(--el-color-danger);
}

.submit-btn {
  width: 100%;
  margin-bottom: 24px;
  padding: 12px;
  font-size: 16px;
}

.result-card {
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.copy-btn {
  padding: 0;
}

.result-content {
  max-height: 400px;
}

.result-content pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  line-height: 1.6;
  color: var(--el-text-color-regular);
}
</style>