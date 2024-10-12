import { Router } from "express";
import * as userController from '../../controllers/user.js'

const route = Router()

route.route("/signup").post(userController.signUp)
route.route("/signin").post(userController.login)

export default route;