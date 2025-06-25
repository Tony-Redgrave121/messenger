import MessageService from "../services/message.service";
import MessageController from "../controllers/message.controller";

const messageService = new MessageService()
const messageController = new MessageController(messageService)

export default messageController