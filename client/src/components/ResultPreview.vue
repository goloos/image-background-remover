<template>
  <div class="result-section">
    <div class="result-grid">
      <!-- 原图 -->
      <div class="result-card">
        <div class="result-image-wrapper">
          <img :src="originalImage" alt="原图" class="result-image">
        </div>
        <p class="result-label">原图</p>
      </div>

      <!-- 箭头 -->
      <div class="arrow">→</div>

      <!-- 结果图 -->
      <div class="result-card">
        <div class="result-image-wrapper checkerboard">
          <img :src="resultImage" alt="结果图" class="result-image">
        </div>
        <p class="result-label">已移除背景</p>
      </div>
    </div>

    <!-- 下载按钮 -->
    <div class="action-buttons">
      <button class="download-btn" @click="$emit('download')">
        ⬇️ 下载 PNG 图片
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultPreview',
  props: {
    originalImage: String,
    resultImage: String
  },
  emits: ['download']
}
</script>

<style scoped>
.result-section {
  margin-top: 30px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.result-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.result-image-wrapper {
  width: 280px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
}

.result-image-wrapper.checkerboard {
  background-image:
    linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
    linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
    linear-gradient(-45deg, transparent 75%, #e0e0e0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.result-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.result-label {
  text-align: center;
  margin-top: 12px;
  color: #666;
  font-size: 14px;
}

.arrow {
  font-size: 48px;
  color: #667eea;
  font-weight: bold;
}

.action-buttons {
  margin-top: 30px;
  text-align: center;
}

.download-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 40px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.download-btn:active {
  transform: translateY(0);
}
</style>
