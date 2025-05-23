import {RefObject} from "react";

const getTitle = (refBlock: RefObject<HTMLDivElement | HTMLAnchorElement | null>, title: string, option: 'color' | 'backgroundColor') => {
    if (!title) return null

    const words = title.split(' ')
    const n = words.length
    const charF = words[0][0], charL = words[n - 1][0]

    if (refBlock.current) {
        refBlock.current.style[option] = `rgb(225, 
                ${charF.charCodeAt(0).toString().slice(0, 2)}, 
                ${charL.charCodeAt(0).toString().slice(0, 2)}
            )`
    }

    return n > 1 ? charF + charL : charF
}

export default getTitle