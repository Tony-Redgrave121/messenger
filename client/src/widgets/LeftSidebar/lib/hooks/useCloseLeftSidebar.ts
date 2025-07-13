import { useCallback } from 'react';
import { setSidebarLeft } from '@entities/Messenger/model/slice/sidebarSlice';
import { useAppDispatch } from '@shared/lib';

const useCloseLeftSidebar = () => {
    const dispatch = useAppDispatch();

    const closeSidebar = useCallback(() => {
        if (window.innerWidth <= 940) dispatch(setSidebarLeft(false));
    }, [dispatch]);

    return {
        closeSidebar,
    };
};

export default useCloseLeftSidebar;
