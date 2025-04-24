import React from 'react'
import style from "./style.module.css"
import {HiOutlineDocumentText} from "react-icons/hi2"
import useLoadBlob from "@hooks/useLoadBlob"
import {useParams} from "react-router-dom"
import getFileName from "@utils/logic/getFileName";

interface IDocumentBlock {
    doc: {
        message_file_id: string,
        message_file_name: string,
        message_file_size: number
    }
}

const DocumentBlock: React.FC<IDocumentBlock> = ({doc}) => {
    const {id} = useParams()
    const {image} = useLoadBlob(`messengers/${id}/${doc.message_file_name}`)

    return (
        <a download={getFileName(doc.message_file_name)} href={image} className={style.DocumentBlock}>
            <HiOutlineDocumentText/>
            <div>
                <h4>{getFileName(doc.message_file_name)}</h4>
                <p>{(doc.message_file_size / 1048576).toFixed(2)} MB &#183;</p>
            </div>
        </a>
    )
}

export default DocumentBlock