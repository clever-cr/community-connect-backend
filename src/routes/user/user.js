import { Router } from "express";
import * as userController from '../../controllers/user.js'

const route = Router()

route.route("/signup").post(userController.signUp)
route.route("/signin").post(userController.login)
route.route("/:userId").get(userController.getUserById)
route.route("/update/:userId").put(userController.updateUser)
route.route("/delete/:userId").delete(userController.deleteUser)
route.route("/").get(userController.getAllUsers)

export default route;