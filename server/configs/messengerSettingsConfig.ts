import MessengerSettingsController from "../controller/messengerSettingsController";
import MessengerSettingsService from "../service/messengerSettingsService";

const messengerSettingsService = new MessengerSettingsService()
const messengerSettingsController = new MessengerSettingsController(messengerSettingsService)

export default messengerSettingsController