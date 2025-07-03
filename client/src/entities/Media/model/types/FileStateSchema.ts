import FileObjectSchema from "./FileObjectSchema"

export default interface FileStateSchema {
    files: FileObjectSchema[] | null,
    popup: boolean,
    type: string
}