import React, { useEffect, useMemo, useState } from 'react';
import debounce from 'debounce';

const useSearch = <T extends object, K extends keyof T>(arr: T[], field: K) => {
    const [filteredArr, setFilteredArr] = useState<T[]>([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        setFilteredArr(arr);
    }, [arr]);

    const searchDebounce = useMemo(
        () =>
            debounce(
                (query: string) =>
                    setFilteredArr(
                        arr.filter(el => {
                            const value = el[field];
                            return typeof value === 'string' && value.toLowerCase().includes(query);
                        }),
                    ),
                200,
            ),
        [arr, field],
    );

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.currentTarget.value.toLowerCase();
        setFilter(query);

        searchDebounce(query);
    };

    return {
        filteredArr,
        setFilteredArr,
        filter,
        setFilter,
        handleInput,
    };
};

export default useSearch;
