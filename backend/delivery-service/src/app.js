// backend/delivery-service/src/app.js
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import deliveryRoutes from './Routes/deliveryRoutes.js'
import logger from './utils/logger.js'

dotenv.config()
const { info, error } = logger

const app = express()
const server = createServer(app)

// socket.io setup
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET','POST'] }
})

// middleware
app.use(cors())
app.use(express.json())

// health check
app.get('/health', (_req, res) => res.sendStatus(200))

// REST routes
app.use('/api/delivery', deliveryRoutes)

// socket.io handlers
io.on('connection', socket => {
  console.log('Client connected:', socket.id)
  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId)
    console.log(`Socket ${socket.id} joined room ${roomId}`)
  })
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// make io accessible to controllers if needed
app.set('io', io)

// connect to MongoDB and start HTTP+WebSocket server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    info('🗄️  Connected to MongoDB')
    const PORT = process.env.PORT || 3005
    server.listen(PORT, () =>
      info(`🚚 Delivery Service listening on port ${PORT}`)
    )
  })
  .catch(err => {
    error('❌ Mongo connection error:', err)
    process.exit(1)
  })
