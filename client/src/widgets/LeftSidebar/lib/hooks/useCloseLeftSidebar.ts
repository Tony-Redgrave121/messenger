import { useAppDispatch } from '@shared/lib';
import { setSidebarLeft } from '../../model/slice/sidebarSlice';

const useCloseLeftSidebar = () => {
    const dispatch = useAppDispatch();

    const closeSidebar = () => {
        if (window.innerWidth <= 940) dispatch(setSidebarLeft(false));
    };

    return {
        closeSidebar,
    };
};

export default useCloseLeftSidebar;
