import OpenGraphService from "../services/openGraph.service";
import OpenGraphController from "../controllers/openGraph.controller";

const openGraphService = new OpenGraphService()
const openGraphController = new OpenGraphController(openGraphService)

export default openGraphController