type ToggleItem = {
    state: boolean,
    mounted: boolean
}

type IToggleState<T extends string> = Record<T, ToggleItem>

export default IToggleState