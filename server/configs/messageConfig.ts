import MessageService from "../service/messageService";
import MessageController from "../controller/messageController";

const messageService = new MessageService()
const messageController = new MessageController(messageService)

export default messageController