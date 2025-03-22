import React from 'react'
import IFilesState from "../../../utils/types/IFilesState";
import getFileObject from "../../../utils/logic/getFileObject";

interface IUpload {
    setState: React.Dispatch<React.SetStateAction<IFilesState>>
}

namespace Upload {
    const uploadFiles = (newFiles: FileList, setState: React.Dispatch<React.SetStateAction<IFilesState>>) => {
        setState(prev => {
            const existingFiles = prev.files || []
            const filesSet = new Set(existingFiles.map(file => file.name))
            const uniqueFiles = Array.from(newFiles).filter(file => !filesSet.has(file.name))

            return {
                ...prev,
                files: [...existingFiles, ...getFileObject(uniqueFiles)]
            }
        })
    }

    export const Image: React.FC<IUpload> = ({setState}) => {
        return (
            <input name='addNewFile' id='addNewFile' type="file" accept='image/*, video/*' style={{display: 'none'}}
                   onChange={(event) => event.target.files && uploadFiles(event.target.files, setState)} multiple/>
        )
    }

    export const Document: React.FC<IUpload> = ({setState}) => {
        return (
            <input name='addNewFile' id='addNewFile' type="file" style={{display: 'none'}}
                   onChange={(event) => event.target.files && uploadFiles(event.target.files, setState)} multiple/>
        )
    }
}

export default Upload