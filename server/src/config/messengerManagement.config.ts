import MessengerManagementController from "../controllers/messengerManagement.controller";
import MessengerManagementService from "../services/messengerManagement.service";

const messengerManagementService = new MessengerManagementService()
const messengerManagementController = new MessengerManagementController(messengerManagementService)

export default messengerManagementController