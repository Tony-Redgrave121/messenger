import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

const useDropDown = (state: boolean, setState: Dispatch<SetStateAction<boolean>>) => {
    const ulRef = useRef<HTMLUListElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const overlayCurr = overlayRef.current;
        const ulCurr = ulRef.current;

        if (!overlayCurr || !ulCurr) return;

        const handleMouseMove = (event: MouseEvent) => {
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            const rect = ulCurr.getBoundingClientRect();
            const ulX = rect.x;
            const ulY = rect.y;

            const isOutsideX = mouseX >= ulX + ulCurr.offsetWidth + 100 || mouseX <= ulX - 100;
            const isOutsideY = mouseY <= ulY - 100 || mouseY >= ulY + ulCurr.offsetHeight + 100;

            if (isOutsideX || isOutsideY) setState(false);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setState(false);
        };

        const handleMouesDown = () => {
            setState(false);
        };

        overlayCurr.addEventListener('mousemove', handleMouseMove);
        overlayCurr.addEventListener('mousedown', handleMouesDown);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            overlayCurr.removeEventListener('mousemove', handleMouseMove);
            overlayCurr.removeEventListener('mousedown', handleMouesDown);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [setState, state]);

    return {
        ulRef,
        overlayRef,
    };
};

export default useDropDown;
