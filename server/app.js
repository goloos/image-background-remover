import express from 'express'
import imageRoutes from './routes/image.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(express.json())

// Routes
app.use('/api', imageRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
