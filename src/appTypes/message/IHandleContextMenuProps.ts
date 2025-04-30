import React, {Dispatch, SetStateAction} from "react";

export default interface IHandleContextMenuProps {
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    setPosition: Dispatch<SetStateAction<{x: number, y: number}>>,
    setContextMenu: Dispatch<SetStateAction<boolean>>
}