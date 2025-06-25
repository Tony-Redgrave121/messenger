import MessengerSettingsController from "../controllers/messengerSettings.controller";
import MessengerSettingsService from "../services/messengerSettings.service";

const messengerSettingsService = new MessengerSettingsService()
const messengerSettingsController = new MessengerSettingsController(messengerSettingsService)

export default messengerSettingsController