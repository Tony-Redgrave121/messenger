import IFileObject from "./IFileObject"

export default interface FilesState {
    files: IFileObject[] | null,
    popup: boolean,
    type: string
}