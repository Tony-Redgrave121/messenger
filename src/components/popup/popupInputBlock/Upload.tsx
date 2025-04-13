import React, {Dispatch, RefObject, SetStateAction} from 'react'
import {IFilesState} from "@appTypes";
import getFileObject from "@utils/logic/getFileObject";

interface IUpload {
    setState: React.Dispatch<React.SetStateAction<IFilesState>>,
    filesRef: RefObject<File[] | null>
}

namespace Upload {
    const uploadFiles = (newFiles: FileList, setState: Dispatch<SetStateAction<IFilesState>>, filesRef: RefObject<File[] | null>) => {
        setState(prev => {
            const existingFiles = prev.files || []
            const filesSet = new Set(existingFiles.map(file => file.name))
            const uniqueFiles = Array.from(newFiles).filter(file => !filesSet.has(file.name))

            filesRef.current = [...filesRef.current!, ...Array.from(newFiles).filter(file => !filesSet.has(file.name))]

            return {
                ...prev,
                files: [...existingFiles, ...getFileObject(uniqueFiles)]
            }
        })
    }

    export const Image: React.FC<IUpload> = ({setState, filesRef}) => {
        return (
            <input name='addNewFile' id='addNewFile' type="file" accept='image/*, video/*' style={{display: 'none'}}
                   onChange={(event) => event.target.files && uploadFiles(event.target.files, setState, filesRef)} multiple/>
        )
    }

    export const Document: React.FC<IUpload> = ({setState, filesRef}) => {
        return (
            <input name='addNewFile' id='addNewFile' type="file" style={{display: 'none'}}
                   onChange={(event) => event.target.files && uploadFiles(event.target.files, setState, filesRef)} multiple/>
        )
    }
}

export default Upload