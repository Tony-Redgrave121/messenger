import SearchController from "../controller/searchController";
import SearchService from "../service/searchService";

const searchService = new SearchService()
const searchController = new SearchController(searchService)

export default searchController