import express from "express"
import "dotenv/config"
import mongoose from "mongoose"
import http from "http"

const app = express()
const PORT = process.env.PORT || 3000
const server = http.createServer(app)
app.use(express.json())
const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl).then(()=>{
  console.log(`Database connected successfully`)
})

server.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`)
}) 