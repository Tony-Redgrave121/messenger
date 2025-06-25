import SearchController from "../controllers/search.controller";
import SearchService from "../services/search.service";

const searchService = new SearchService()
const searchController = new SearchController(searchService)

export default searchController