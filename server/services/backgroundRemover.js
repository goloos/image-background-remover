import fetch from 'node-fetch'
import FormData from 'form-data'

// 百度图像分割 API 配置
// 申请地址：https://console.bce.baidu.com/
const BAIDU_API_CONFIG = {
  // TODO: 替换为你的百度 API Key
  apiKey: process.env.BAIDU_API_KEY || 'YOUR_BAIDU_API_KEY',
  secretKey: process.env.BAIDU_SECRET_KEY || 'YOUR_BAIDU_SECRET_KEY',
  // 百度图像分割 API 地址
  apiUrl: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/body_seg'
}

// remove.bg API 配置
const REMOVEBG_API_CONFIG = {
  // TODO: 替换为你的 remove.bg API Key
  apiKey: process.env.REMOVEBG_API_KEY || 'YOUR_REMOVEBG_API_KEY',
  apiUrl: 'https://api.remove.bg/v1.0/removebg'
}

/**
 * 获取百度 API Access Token
 */
async function getBaiduAccessToken() {
  const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_API_CONFIG.apiKey}&client_secret=${BAIDU_API_CONFIG.secretKey}`
  
  const response = await fetch(tokenUrl, {
    method: 'POST'
  })
  
  const data = await response.json()
  
  if (data.access_token) {
    return data.access_token
  }
  
  throw new Error(`获取百度 Access Token 失败: ${JSON.stringify(data)}`)
}

/**
 * 使用百度 API 移除背景
 */
async function removeBackgroundWithBaidu(imageBuffer) {
  // 先获取 token
  const accessToken = await getBaiduAccessToken()
  
  const formData = new FormData()
  formData.append('image', imageBuffer.toString('base64'))
  formData.append('type', 'Foreground')
  
  const response = await fetch(`${BAIDU_API_CONFIG.apiUrl}?access_token=${accessToken}`, {
    method: 'POST',
    body: formData
  })
  
  if (!response.ok) {
    throw new Error(`百度 API 请求失败: ${response.status}`)
  }
  
  const data = await response.json()
  
  if (data.error_code) {
    throw new Error(`百度 API 错误: ${data.error_msg || data.error_code}`)
  }
  
  // 百度返回的是处理后的图像数据（base64）
  if (data.results && data.results[0]) {
    const resultBase64 = data.results[0]
    return Buffer.from(resultBase64, 'base64')
  }
  
  throw new Error('百度 API 返回数据格式错误')
}

/**
 * 使用 remove.bg API 移除背景
 */
async function removeBackgroundWithRemoveBg(imageBuffer) {
  const formData = new FormData()
  formData.append('image_file', imageBuffer, {
    filename: 'image.png',
    contentType: 'image/png'
  })
  formData.append('size', 'auto')
  formData.append('format', 'png')
  
  const response = await fetch(REMOVEBG_API_CONFIG.apiUrl, {
    method: 'POST',
    headers: {
      'X-Api-Key': REMOVEBG_API_CONFIG.apiKey
    },
    body: formData
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.errors?.[0]?.title || 'remove.bg API 请求失败')
  }
  
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

/**
 * 主函数：移除图片背景
 * @param {Buffer} imageBuffer - 输入图片的 Buffer
 * @param {string} provider - 使用哪个 API ('baidu' 或 'removebg')
 * @returns {Promise<Buffer>} - 处理后的图片 Buffer (PNG 透明背景)
 */
export async function removeBackground(imageBuffer, provider = 'baidu') {
  try {
    if (provider === 'removebg') {
      return await removeBackgroundWithRemoveBg(imageBuffer)
    }
    
    // 默认使用百度
    return await removeBackgroundWithBaidu(imageBuffer)
  } catch (error) {
    console.error('背景移除失败:', error.message)
    throw error
  }
}

export default removeBackground
