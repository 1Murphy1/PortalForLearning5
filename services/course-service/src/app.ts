import express from 'express'
import { connectDB } from './config/db'
import dotenv from 'dotenv'

import { courseRoutes } from './routes/courseRoutes'
import path from 'path'

dotenv.config()
const PORT = process.env.PORT_COURSE || 3000

const api = process.env.API_PREFIX

connectDB()

const app = express()
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use(`${api}`, courseRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
