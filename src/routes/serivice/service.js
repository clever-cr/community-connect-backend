import {Router} from "express";
import * as serviceController from "../../controllers/service.js"

const route = Router()
route.route("/create").post(serviceController.createService)
route.route("/getAll").get(serviceController.getAllServices)
route.route("/:serviceId").get(serviceController.getServiceById)
route.route("/:serviceId").put(serviceController.updateService)
route.route("/:serviceId").delete(serviceController.deleteService)
export default route