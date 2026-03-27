<template>
  <div class="upload-section">
    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      <span>❌ {{ error }}</span>
      <button @click="$emit('reset')">重新上传</button>
    </div>

    <!-- 上传区域 - 初始状态 -->
    <div
      v-if="!originalImage && !isProcessing"
      class="upload-area"
      :class="{ 'drag-over': isDragOver }"
      @click="triggerFileInput"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        @change="handleFileSelect"
        style="display: none"
      >
      <div class="upload-icon">📤</div>
      <h3>点击或拖拽上传图片</h3>
      <p>支持 JPG / PNG / WebP 格式，最大 10MB</p>
    </div>

    <!-- 原图预览 + 重新上传 -->
    <div v-if="originalImage && !resultImage" class="preview-section">
      <div class="preview-box">
        <img :src="originalImage" alt="原图" class="preview-image">
        <p class="preview-label">原图</p>
      </div>
      <button class="reset-btn" @click="$emit('reset')">重新上传</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadArea',
  props: {
    isProcessing: Boolean,
    originalImage: String,
    resultImage: String,
    error: String
  },
  emits: ['upload', 'reset'],
  data() {
    return {
      isDragOver: false
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click()
    },

    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.validateAndEmit(file)
      }
    },

    handleDrop(event) {
      this.isDragOver = false
      const file = event.dataTransfer.files[0]
      if (file) {
        this.validateAndEmit(file)
      }
    },

    validateAndEmit(file) {
      // 格式校验
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        alert('仅支持 JPG/PNG/WebP 格式')
        return
      }

      // 大小校验 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('图片大小不能超过 10MB')
        return
      }

      this.$emit('upload', file)
    }
  }
}
</script>

<style scoped>
.upload-section {
  width: 100%;
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #c00;
}

.error-message button {
  background: #c00;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
}

.error-message button:hover {
  background: #a00;
}

.upload-area {
  background: white;
  border: 3px dashed #ddd;
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #667eea;
  background: #f8f7ff;
}

.upload-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.upload-area h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.upload-area p {
  color: #999;
  font-size: 14px;
}

.preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.preview-box {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
}

.preview-label {
  text-align: center;
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

.reset-btn {
  background: #f5f5f5;
  color: #666;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.reset-btn:hover {
  background: #eee;
}
</style>
