import express from 'express'
import userRoute from "./user/user.js"
import serviceRoute from "./serivice/service.js"
import bookingRoute from "./booking/booking.js"
const app = express()

app.use("/user",userRoute)
app.use("/service",serviceRoute)
app.use("/booking",bookingRoute)

export default app