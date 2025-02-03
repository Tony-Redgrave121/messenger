const zeroPad = (num: number) => {
    return num.toString().padStart(2, '0')
}

export const getDate = (date: Date) => {
    const newDate = new Date(date)
    const currentDate = new Date()
    const time = new Date().getTime() - newDate.getTime()

    if (time <= 86400000) {
        return getTime(newDate)
    } else if (time <= 86400000 * new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0).getDate()) {
        return `${newDate.toLocaleString('en', { month: 'short'})} ${newDate.getDate()}`
    } else {
        return `${zeroPad(newDate.getMonth() + 1)}/${zeroPad(newDate.getDay())}/${newDate.getFullYear()}`
    }
}

export const getTime = (date: Date) => {
    return `${zeroPad(date.getHours())}:${zeroPad(date.getMinutes())}`
}