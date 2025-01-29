export const getDate = (date: Date) => {
    const newDate = new Date(date)
    const currentDate = new Date()
    const time = new Date().getTime() - newDate.getTime()

    if (time <= 86400000) {
        return `${newDate.getHours()}:${newDate.getMinutes()}`
    } else if (time <= 86400000 * new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0).getDate()) {
        return `${newDate.toLocaleString('en', { month: 'short'})} ${newDate.getDate()}`
    } else {
        return `${newDate.getMonth() + 1}/${newDate.getDay()}/${newDate.getFullYear()}`
    }
}