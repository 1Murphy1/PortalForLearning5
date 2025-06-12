import express from 'express'
import { connectDB } from './config/db'
import dotenv from 'dotenv'
import { authRoutes } from './routes/authRoutes'


dotenv.config()
const PORT = process.env.PORT_AUTH || 3001

const api = process.env.API_PREFIX

connectDB()

const app = express()
app.use(express.json())

app.use(`${api}/auth`, authRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
