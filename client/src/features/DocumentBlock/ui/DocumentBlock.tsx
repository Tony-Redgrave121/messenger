import { FC } from 'react';
import { HiOutlineDocumentText } from 'react-icons/hi2';
import MessageFileSchema from '@entities/Media/model/types/MessageFileSchema';
import { useLoadBlob, getFileName } from '@shared/lib';
import style from './style.module.css';

interface IDocumentBlockProps {
    doc: MessageFileSchema;
}

const DocumentBlock: FC<IDocumentBlockProps> = ({ doc }) => {
    const { image } = useLoadBlob(`messengers/${doc.message_file_path}/${doc.message_file_name}`);

    return (
        <a
            download={getFileName(doc.message_file_name)}
            href={image}
            className={style.DocumentBlock}
        >
            <HiOutlineDocumentText />
            <div>
                <h4>{getFileName(doc.message_file_name)}</h4>
                <p>{(doc.message_file_size / 1048576).toFixed(2)} MB &#183;</p>
            </div>
        </a>
    );
};

export default DocumentBlock;
