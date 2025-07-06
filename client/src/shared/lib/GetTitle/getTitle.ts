import { RefObject } from 'react';

const getTitle = (
    refBlock: RefObject<HTMLDivElement | HTMLAnchorElement | null>,
    title: string,
    option: 'color' | 'backgroundColor',
) => {
    if (!title) return null;

    const words = title.split(' ');
    const initials = words.length > 1 ? words[0][0] + words[words.length - 1][0] : words[0][0];

    const hash = Array.from(title).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = `hsl(${hash % 360}, 60%, 60%)`;

    if (refBlock.current) refBlock.current.style[option] = color;
    return initials.toUpperCase();
};

export default getTitle;
