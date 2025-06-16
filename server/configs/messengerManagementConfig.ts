import MessengerManagementController from "../controller/messengerManagementController";
import MessengerManagementService from "../service/messengerManagementService";

const messengerManagementService = new MessengerManagementService()
const messengerManagementController = new MessengerManagementController(messengerManagementService)

export default messengerManagementController