import UserController from "../controller/userController";
import UserService from "../service/userService";

const userService = new UserService()
const userController = new UserController(userService)

export default userController