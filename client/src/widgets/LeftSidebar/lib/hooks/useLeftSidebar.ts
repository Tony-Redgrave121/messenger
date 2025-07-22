import debounce from 'debounce';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import getFilteredMessengersApi from '@widgets/LeftSidebar/api/getFilteredMessengersApi';
import mapSearchDTO from '@widgets/LeftSidebar/api/mappers/mapSearchDTO';
import { MessengerCreationSchema } from '@features/CreateMessenger';
import { UnifiedMessengerSchema } from '@features/MessengerSearch';
import { setSidebarLeft } from '@entities/Messenger';
import { useAppDispatch, useAppSelector, useAbortController } from '@shared/lib';
import { MessengerTypes } from '@shared/types';

const useLeftSidebar = () => {
    const [settings, setSettings] = useState(false);
    const [messengerDropDown, setMessengerDropDown] = useState(false);
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
    const { getSignal } = useAbortController();

    const [searchRes, setSearchRes] = useState<UnifiedMessengerSchema[]>([]);
    const [active, setActive] = useState<MessengerTypes>('chat');

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
        refSearch,
        setMessengerDropDown,
        messengerDropDown,
        messengerCreation,
        setMessengerCreation,
        profile,
        setProfile,
        searchRes,
        active,
        setActive,
        handleInput,
        search,
    };
};

export default useLeftSidebar;
