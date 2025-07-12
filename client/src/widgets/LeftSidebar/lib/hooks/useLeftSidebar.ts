import debounce from 'debounce';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import getFilteredMessengersApi from '@widgets/LeftSidebar/api/getFilteredMessengersApi';
import mapSearchDTO from '@widgets/LeftSidebar/api/mappers/mapSearchDTO';
import { MessengerCreationSchema } from '@features/CreateMessenger/model/types/MessengerCreationSchema';
import UnifiedMessengerSchema from '@features/MessengerSearch/model/types/UnifiedMessengerSchema';
import { useAppDispatch, useAppSelector } from '@shared/lib';
import { useAbortController } from '@shared/lib';
import { MessengerTypes } from '@shared/types';
import { setSidebarLeft } from '../../model/slice/sidebarSlice';
import useCloseLeftSidebar from './useCloseLeftSidebar';

const useLeftSidebar = () => {
    const [settings, setSettings] = useState(false);
    const [messenger, setMessenger] = useState(false);
    const [search, setSearch] = useState(false);
    const [profile, setProfile] = useState(false);
    const [filter, setFilter] = useState('');
    const [messengerCreation, setMessengerCreation] = useState<MessengerCreationSchema>({
        state: false,
        type: undefined,
    });

    const refSearch = useRef<HTMLDivElement>(null);
    const refSidebar = useRef<HTMLDivElement>(null);

    const sidebarLeft = useAppSelector(state => state.sidebar.sidebarLeft);
    const { userImg, userName, userId } = useAppSelector(state => state.user);

    const navigate = useNavigate();
    const { getSignal } = useAbortController();
    const { closeSidebar } = useCloseLeftSidebar();

    const [searchRes, setSearchRes] = useState<UnifiedMessengerSchema[]>([]);
    const [active, setActive] = useState<MessengerTypes>('chat');

    const navigateChat = useCallback(
        (userId: string) => {
            closeSidebar();
            return navigate(`/chat/${userId}`);
        },
        [closeSidebar, navigate],
    );

    const searchDebounce = useMemo(
        () =>
            debounce(async (query: string, type: string) => {
                if (!query) return;

                try {
                    const signal = getSignal();
                    const searched = await getFilteredMessengersApi(query, type, signal);

                    if (searched.status === 200) {
                        const unifiedMessengers = mapSearchDTO(searched.data);
                        setSearchRes(unifiedMessengers);
                    }
                } catch (e) {
                    console.error(e);
                }
            }, 200),
        [],
    );

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.currentTarget.value.toLowerCase();
        setFilter(query);

        if (query.length > 3) searchDebounce(query, active);
    };

    useEffect(() => {
        setSearchRes([]);
        searchDebounce(filter, active);
    }, [active]);

    useEffect(() => {
        if (filter.length > 3) setSearch(true);
        else setSearch(false);
    }, [filter]);

    const dispatch = useAppDispatch();
    const handleResize = debounce(() => {
        if (window.innerWidth >= 940) dispatch(setSidebarLeft(true));
    }, 100);

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [dispatch, handleResize]);

    return {
        sidebarLeft,
        refSidebar,
        setSettings,
        settings,
        userImg,
        userName,
        userId,
        refSearch,
        setMessenger,
        messenger,
        messengerCreation,
        setMessengerCreation,
        profile,
        setProfile,
        navigateChat,
        searchRes,
        active,
        setActive,
        handleInput,
        search,
    };
};

export default useLeftSidebar;
