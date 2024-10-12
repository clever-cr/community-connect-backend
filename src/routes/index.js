import express from 'express'
import userRoute from "./user/user.js"
import serviceRoute from "./serivice/service.js"
const app = express()

app.use("/user",userRoute)
app.use("/service",serviceRoute)

export default app