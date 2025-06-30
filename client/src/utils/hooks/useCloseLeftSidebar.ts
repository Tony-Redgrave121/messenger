import {useAppDispatch} from "../../rebuild/shared/lib";
import {setSidebarLeft} from "@store/reducers/appReducer";

const useCloseLeftSidebar = () => {
    const dispatch = useAppDispatch()

    const closeSidebar = ()=> {
        if (window.innerWidth <= 940) dispatch(setSidebarLeft(false))
    }

    return {
        closeSidebar,
    }
}

export default useCloseLeftSidebar