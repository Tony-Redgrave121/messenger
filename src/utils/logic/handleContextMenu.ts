import {IHandleContextMenuProps} from "@appTypes";

const handleContextMenu = ({event, setPosition, setContextMenu, height}: IHandleContextMenuProps) => {
    event.preventDefault()
    const parent = event.currentTarget.getBoundingClientRect()

    let x = event.clientX - parent.left, y = event.clientY - parent.top
    const clientWidth = event.currentTarget.clientWidth, clientHeight = event.currentTarget.clientHeight

    if (x + 170 > clientWidth) x = clientWidth - 170
    if (y + height > clientHeight) y = clientHeight - height

    setPosition({x: x, y: y})
    setContextMenu(prev => !prev)
}

export default handleContextMenu