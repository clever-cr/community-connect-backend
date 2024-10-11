import express from 'express'
import userRoute from "./user/user.js"
const app = express()

app.use("/user",userRoute)

export default app