import React, { Dispatch, RefObject, SetStateAction } from 'react';

interface IHandleContextMenuProps {
    refContainer: RefObject<HTMLElement | null>;
    event: React.MouseEvent<HTMLDivElement, MouseEvent>;
    setPosition: Dispatch<SetStateAction<{ x: number; y: number }>>;
    setContextMenu: Dispatch<SetStateAction<boolean>>;
}

const MENU_WIDTH = 200;
const MENU_HEIGHT = 150;

const handleContextMenu = ({
    refContainer,
    event,
    setPosition,
    setContextMenu,
}: IHandleContextMenuProps) => {
    const container = refContainer.current;
    if (!container) return;

    event.preventDefault();
    const parent = container.getBoundingClientRect();

    let objectX = event.clientX - parent.left;
    let objectY = event.clientY - parent.top;

    const parentWidth = parent.width;
    const parentHeight = parent.height;

    if (objectX + MENU_WIDTH > parentWidth) objectX = parentWidth - MENU_WIDTH;
    if (objectY + MENU_HEIGHT > parentHeight) objectY = parentHeight - MENU_HEIGHT;

    setPosition({ x: objectX, y: objectY });
    setContextMenu(prev => !prev);
};

export default handleContextMenu;
