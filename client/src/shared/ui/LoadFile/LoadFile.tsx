import { FC, memo, useRef } from 'react';
import getTitle from '@shared/lib/GetTitle/getTitle';
import useLoadBlob from '@shared/lib/hooks/useLoadBlob/useLoadBlob';
import style from './load-file.module.css';

interface ILoadImage {
    imagePath?: string;
    imageTitle: string;
}

const LoadFile: FC<ILoadImage> = memo(({ imagePath, imageTitle }) => {
    const refImageContainer = useRef<HTMLDivElement>(null);
    const { load, image } = useLoadBlob(imagePath);

    return (
        <div className={style.ImageContainer} ref={refImageContainer}>
            {load && image ? (
                <img src={image} alt={imageTitle} />
            ) : (
                <h1>{getTitle(refImageContainer, imageTitle, 'backgroundColor')}</h1>
            )}
        </div>
    );
});

LoadFile.displayName = 'LoadFile';

export default LoadFile;
