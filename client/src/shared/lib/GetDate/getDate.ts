const zeroPad = (num: number) => num.toString().padStart(2, '0');

export const getDate = (date: string | Date, isUserLastSeen?: boolean) => {
    const newDate = new Date(date);
    if (isUserLastSeen && newDate.getTime() >= new Date().getTime() - 12000) return 'Online';

    const currentDate = new Date();
    const time = new Date().getTime() - newDate.getTime();

    if (time <= 86400000) {
        return getTime(newDate);
    } else if (
        time <=
        86400000 * new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    ) {
        return `${newDate.toLocaleString('en', { month: 'short' })} ${newDate.getDate()}`;
    } else {
        return `${zeroPad(newDate.getMonth() + 1)}/${zeroPad(newDate.getDay())}/${newDate.getFullYear()}`;
    }
};

export const getTime = (date: string | Date) => {
    const newDate = new Date(date);
    return `${zeroPad(newDate.getHours())}:${zeroPad(newDate.getMinutes())}`;
};

export const getVideoTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${zeroPad(seconds)}`;
};
