import React, {FC} from 'react';

interface IPlayerProps {
    src: string,
    id: string
}

const Player: FC<IPlayerProps> = ({src, id}) => {
    return (
        <video src={src} id={id}>
            
        </video>
    )
}

export default Player