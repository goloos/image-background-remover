<template>
  <div class="loading-section">
    <div class="loading-content">
      <div class="spinner"></div>
      <p class="loading-text">🤖 AI 正在移除背景中...</p>
      <p class="loading-hint">预计需要 3-5 秒，请稍候</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner'
}
</script>

<style scoped>
.loading-section {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.loading-content {
  background: white;
  border-radius: 16px;
  padding: 40px 60px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
}

.loading-hint {
  font-size: 14px;
  color: #999;
}
</style>
