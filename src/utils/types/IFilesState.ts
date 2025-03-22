import IFileObject from "./IFileObject"

export default interface IFilesState {
    files: IFileObject[] | null,
    popup: boolean,
    type: string
}