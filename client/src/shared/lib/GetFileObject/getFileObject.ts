const getFileObject = (files: FileList | File[] | null) => {
    if (!Array.isArray(files)) files = Array.from(files || []);

    return files.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
    }));
};

export default getFileObject;
