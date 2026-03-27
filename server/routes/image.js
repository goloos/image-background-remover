import express from 'express'
import multer from 'multer'
import { removeBackground } from '../services/backgroundRemover.js'

const router = express.Router()

// 配置 multer 存储（内存中）
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('仅支持 JPG/PNG/WebP 格式'))
    }
  }
})

/**
 * POST /api/remove-background
 * 移除图片背景
 */
router.post('/remove-background', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请上传图片'
      })
    }

    const { provider } = req.query
    const resultBuffer = await removeBackground(req.file.buffer, provider)

    // 返回 PNG 图片
    res.set({
      'Content-Type': 'image/png',
      'Content-Length': resultBuffer.length
    })
    res.send(resultBuffer)

  } catch (error) {
    console.error('处理失败:', error)
    res.status(500).json({
      success: false,
      message: error.message || '图片处理失败，请重试'
    })
  }
})

/**
 * POST /api/remove-background-base64
 * 接收 base64 格式的图片（备用接口）
 */
router.post('/remove-background-base64', express.json({ limit: '10mb' }), async (req, res) => {
  try {
    const { image, provider } = req.body

    if (!image) {
      return res.status(400).json({
        success: false,
        message: '请提供图片数据'
      })
    }

    // 去除 data:image/xxx;base64, 前缀
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
    const imageBuffer = Buffer.from(base64Data, 'base64')

    const resultBuffer = await removeBackground(imageBuffer, provider)

    res.set({
      'Content-Type': 'image/png',
      'Content-Length': resultBuffer.length
    })
    res.send(resultBuffer)

  } catch (error) {
    console.error('处理失败:', error)
    res.status(500).json({
      success: false,
      message: error.message || '图片处理失败，请重试'
    })
  }
})

export default router
