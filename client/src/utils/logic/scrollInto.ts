const scrollInto = (id: string) => {
    document.getElementById(id)?.scrollIntoView({block: 'center'})
}

export default scrollInto