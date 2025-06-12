import express from 'express'
import { connectDB } from './config/db'
import dotenv from 'dotenv'
import { lessonRoutes } from './routes/lessonRoutes'

dotenv.config()
const PORT = process.env.PORT_LESSON || 3000

const api = process.env.API_PREFIX

connectDB()

const app = express()
app.use(express.json())

app.use(`${api}`, lessonRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
