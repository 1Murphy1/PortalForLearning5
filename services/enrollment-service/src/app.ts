import express from 'express'
import { connectDB } from './config/db'
import dotenv from 'dotenv'
import path from 'path'
import { enrollmentRoutes } from './routes/enrollmentRoutes'

dotenv.config()
const PORT = process.env.PORT_ENROLLMENT || 3000

const api = process.env.API_PREFIX

connectDB()

const app = express()
app.use(express.json())

app.use(`${api}`, enrollmentRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
