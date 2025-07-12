import { useCallback } from 'react';
import { useAppDispatch } from '@shared/lib';
import { setSidebarLeft } from '../../model/slice/sidebarSlice';

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
