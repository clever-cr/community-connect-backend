import {Router} from "express";
import * as bookingController from "../../controllers/book.js"

const route = Router()

route.route("/create").post(bookingController.createBooking)
route.route("/getAll/:userId").get(bookingController.getBookingsById)

export default route