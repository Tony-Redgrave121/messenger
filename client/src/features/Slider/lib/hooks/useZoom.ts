import { useEffect, useRef, useState } from 'react';

const useZoom = () => {
    const [zoomSize, setZoomSize] = useState(100);
    const refZoom = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = refZoom.current;
        if (!img) return;

        const { width, height } = img.getBoundingClientRect();
        const clientWidth = window.innerWidth,
            clientHeight = window.innerHeight;

        if (width > clientWidth || height > clientHeight)
            img.addEventListener('mousedown', draggableImage);
        else {
            img.style.left = '0';
            img.style.top = '0';
            img.removeEventListener('mousedown', draggableImage);
        }

        return () => img.removeEventListener('mousedown', draggableImage);
    }, [zoomSize]);

    const draggableImage = (event: MouseEvent) => {
        if (!refZoom.current) return;
        const img = refZoom.current;
        const imgRect = img.getBoundingClientRect();

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const restWidth = imgRect.width - screenWidth;
        const restHeight = imgRect.height - screenHeight;

        const startX = event.clientX;
        const startY = event.clientY;
        const offsetX = imgRect.left;
        const offsetY = imgRect.top;

        const handlerDrag = (event: MouseEvent) => {
            const dx = event.clientX - startX,
                dy = event.clientY - startY;
            const left = offsetX + dx,
                top = offsetY + dy;
            const halfWidth = restWidth / 2,
                halfHeight = restHeight / 2;

            if (restWidth >= 0 && left >= -halfWidth && left <= halfWidth)
                img.style.left = left + 'px';
            if (restHeight >= 0 && top >= -halfHeight && top <= halfHeight)
                img.style.top = top + 'px';
        };

        const stopDrag = () => {
            img.removeEventListener('mousemove', handlerDrag);
            img.removeEventListener('mouseup', stopDrag);
        };

        img.addEventListener('mousemove', handlerDrag);
        img.addEventListener('mouseup', stopDrag);

        return () => {
            refZoom.current!.addEventListener('mousemove', handlerDrag);
            refZoom.current!.addEventListener('mouseup', () =>
                refZoom.current!.removeEventListener('mousemove', event => handlerDrag(event)),
            );
        };
    };

    return {
        setZoomSize,
        zoomSize,
        refZoom,
    };
};

export default useZoom;
