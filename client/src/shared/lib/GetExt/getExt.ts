const getExt = (name: string) => {
    const type = name.split('.');
    return type[type.length - 1].toLowerCase();
};

export default getExt;
