export const getStyles = (classNames: string[], style: {[className: string]: string}) => {
    return classNames.map(name => style[name]).join(' ')
}