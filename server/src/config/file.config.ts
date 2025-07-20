import FileService from "../services/file.service";
import FileController from "../controllers/file.controller";

const fileService = new FileService()
const fileController = new FileController(fileService)

export default fileController