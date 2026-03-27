<template>
  <div class="app">
    <header class="header">
      <div class="container">
        <h1>🖼️ 图片背景移除工具</h1>
        <p class="subtitle">上传图片，AI 自动移除背景</p>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <UploadArea
          :is-processing="isProcessing"
          :original-image="originalImage"
          :result-image="resultImage"
          :error="error"
          @upload="handleUpload"
          @reset="handleReset"
        />

        <LoadingSpinner v-if="isProcessing" />

        <ResultPreview
          v-if="resultImage && !isProcessing"
          :original-image="originalImage"
          :result-image="resultImage"
          @download="handleDownload"
        />
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <p>© 2026 Image Background Remover. All rights reserved.</p>
        <p class="disclaimer">仅供学习交流使用，请勿用于非法用途</p>
      </div>
    </footer>
  </div>
</template>

<script>
import UploadArea from './components/UploadArea.vue'
import ResultPreview from './components/ResultPreview.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'

export default {
  name: 'App',
  components: {
    UploadArea,
    ResultPreview,
    LoadingSpinner
  },
  data() {
    return {
      isProcessing: false,
      originalImage: null,
      resultImage: null,
      error: null
    }
  },
  methods: {
    async handleUpload(file) {
      // 创建原图预览
      this.originalImage = URL.createObjectURL(file)
      this.resultImage = null
      this.error = null
      this.isProcessing = true

      const formData = new FormData()
      formData.append('image', file)

      try {
        const response = await fetch('/api/remove-background', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || '处理失败，请重试')
        }

        const blob = await response.blob()
        this.resultImage = URL.createObjectURL(blob)
      } catch (err) {
        this.error = err.message || '网络错误，请重试'
      } finally {
        this.isProcessing = false
      }
    },

    handleReset() {
      if (this.originalImage) {
        URL.revokeObjectURL(this.originalImage)
      }
      if (this.resultImage) {
        URL.revokeObjectURL(this.resultImage)
      }
      this.originalImage = null
      this.resultImage = null
      this.error = null
      this.isProcessing = false
    },

    handleDownload() {
      if (!this.resultImage) return

      const link = document.createElement('a')
      link.href = this.resultImage
      link.download = 'removed-background.png'
      link.click()
    }
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px 0;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 14px;
}

.main {
  flex: 1;
  padding: 40px 0;
}

.footer {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px 0;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.disclaimer {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}
</style>
