const getFileName = (fileName: string) => {
    return fileName.substring(fileName.indexOf('.') + 1, fileName.length)
}

export default getFileName