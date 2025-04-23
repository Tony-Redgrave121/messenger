export const getStyles = (classNames: string[], style: {[className: string]: string}) => {
    return classNames.reduce((acc, className) => acc + `${style[className]} `, '')
}