import $api from "@shared/api/axiosApi";
import {LOGOUT_ROUTE} from "@shared/config";

const logoutApi = ()=> {
    return $api.post(LOGOUT_ROUTE)
}

export default logoutApi