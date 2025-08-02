import React, { FC, memo } from 'react';
import { useLoadBlob } from '@shared/lib';
import { LoadFile } from '@shared/ui';
import style from './style.module.css';

interface IImageBlockProps {
    imagePath: string;
    info: {
        name: string;
        type: string;
    };
}

const ImageBlock: FC<IImageBlockProps> = memo(({ imagePath, info }) => {
    const { image } = useLoadBlob(imagePath);

    return (
        <>
            {image ? (
                <div
                    className={`${style.ImageBlock} ${style.ImageGradient}`}
                    style={{ backgroundImage: `url('${image}')` }}
                >
                    <div className={style.TitleBlock}>
                        <h1>{info.name}</h1>
                        <p>{info.type}</p>
                    </div>
                </div>
            ) : (
                <div className={`${style.ImageBlock} ${style.FullImage}`}>
                    <LoadFile imagePath={''} imageTitle={info.name} />
                    <div className={style.TitleBlock}>
                        <h1>{info.name}</h1>
                        <p>{info.type}</p>
                    </div>
                </div>
            )}
        </>
    );
});

ImageBlock.displayName = 'ImageBlock';

export default ImageBlock;
